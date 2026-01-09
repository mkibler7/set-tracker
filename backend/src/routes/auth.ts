import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import RefreshSession from "../models/RefreshSession.js";
import crypto from "crypto";
import { loginSchema, registerSchema } from "../validators/authInput.js";
import {
  clearAccessCookie,
  clearRefreshCookie,
  hashToken,
  setAccessCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
} from "../utils/tokens.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success)
    return res.status(400).json({ message: parsed.error.message });

  const { email, password, displayName } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    passwordHash,
    displayName: displayName?.trim() ?? "",
  });

  const refreshToken = signRefreshToken(String(user._id));
  const tokenHash = hashToken(refreshToken);

  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await RefreshSession.create({ userId: user._id, tokenHash, expiresAt });

  setRefreshCookie(res, refreshToken);

  const accessToken = signAccessToken(String(user._id));
  setAccessCookie(res, accessToken);

  res.status(201).json({
    user: {
      id: String(user._id),
      email: user.email,
      displayName: user.displayName ?? "",
    },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success)
    return res.status(400).json({ message: parsed.error.message });

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const refreshToken = signRefreshToken(String(user._id));
  const tokenHash = hashToken(refreshToken);

  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await RefreshSession.create({ userId: user._id, tokenHash, expiresAt });

  setRefreshCookie(res, refreshToken);

  const accessToken = signAccessToken(String(user._id));
  setAccessCookie(res, accessToken);

  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      displayName: user.displayName ?? "",
    },
  });
});

router.post("/refresh", async (req: Request, res: Response) => {
  const token = req.cookies?.rt as string | undefined;

  // If no refresh token cookie, clear any access cookie too (defensive)
  if (!token) {
    clearRefreshCookie(res);
    clearAccessCookie(res);
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      sub: string;
    };
    const tokenHash = hashToken(token);

    const session = await RefreshSession.findOne({
      tokenHash,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    // If session invalid/expired/revoked: clear cookies so client stops sending junk
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() < Date.now()
    ) {
      clearRefreshCookie(res);
      clearAccessCookie(res);
      return res.status(401).json({ message: "Refresh token invalid" });
    }

    // Rotate: revoke old
    session.revokedAt = new Date();
    await session.save();

    // Issue new refresh
    const newRefreshToken = signRefreshToken(payload.sub);
    const newHash = hashToken(newRefreshToken);

    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await RefreshSession.create({
      userId: payload.sub,
      tokenHash: newHash,
      expiresAt,
    });
    setRefreshCookie(res, newRefreshToken);

    // Issue new access
    const accessToken = signAccessToken(payload.sub);
    setAccessCookie(res, accessToken);

    // Cookie-based auth: frontend does not need the token body
    return res.json({ ok: true });
  } catch {
    // JWT verify failed (expired / invalid signature): clear cookies here too
    clearRefreshCookie(res);
    clearAccessCookie(res);
    return res.status(401).json({ message: "Refresh token invalid" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  const token = req.cookies?.rt as string | undefined;

  if (token) {
    const tokenHash = hashToken(token);
    await RefreshSession.updateOne(
      { tokenHash },
      { $set: { revokedAt: new Date() } }
    );
  }

  clearRefreshCookie(res);
  clearAccessCookie(res);

  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await User.findById(userId).select("email displayName");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({
    id: String(user._id),
    email: user.email,
    displayName: user.displayName ?? "",
  });
});

export default router;
