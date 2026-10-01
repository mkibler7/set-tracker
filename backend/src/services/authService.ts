import crypto from "crypto";
import type { Response } from "express";
import RefreshSession, { type RevokedReason } from "../models/RefreshSession.js";
import {
  hashToken,
  setAccessCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
} from "../utils/tokens.js";

// Revocations that end a family for good: a grace-window refresh must not revive it
const TERMINAL_REASONS: RevokedReason[] = ["logout", "reuse", "password_reset"];

function refreshTtlMs() {
  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  return days * 24 * 60 * 60 * 1000;
}

/**
 * How long a just-rotated refresh token is still honored. Covers several tabs
 * (or a page load plus a 401 retry) refreshing at the same moment with the
 * same cookie: the first request rotates, the others land here.
 */
function reuseGraceMs() {
  const seconds = Number(process.env.REFRESH_REUSE_GRACE_SECONDS ?? "30");
  return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : 30_000;
}

type SessionLike = { _id: unknown; familyId?: string | null };

function familyOf(session: SessionLike) {
  return session.familyId ?? String(session._id);
}

/**
 * Issue a refresh session and set the auth cookies.
 * Omit familyId for a fresh login (starts a new family).
 */
export async function issueSession(
  res: Response,
  userId: string,
  familyId: string = crypto.randomUUID(),
) {
  const refreshToken = signRefreshToken(userId);

  await RefreshSession.create({
    userId,
    familyId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + refreshTtlMs()),
  });

  setRefreshCookie(res, refreshToken);
  setAccessCookie(res, signAccessToken(userId));
}

export type RotateResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "reuse" };

/**
 * Exchange a refresh token (already JWT-verified) for a new session.
 *
 * - Atomic: the token is claimed with a single findOneAndUpdate, so two
 *   concurrent requests can never both rotate it.
 * - Grace: a token rotated within the grace window still gets a new session,
 *   unless its family was ended by logout, reuse or password reset.
 * - Reuse: a rotated token replayed after the grace window means the token
 *   was probably stolen, so the whole family is revoked.
 */
export async function rotateSession(
  res: Response,
  refreshToken: string,
  jwtUserId: string,
): Promise<RotateResult> {
  const tokenHash = hashToken(refreshToken);
  const now = new Date();

  const claimed = await RefreshSession.findOneAndUpdate(
    { tokenHash, revokedAt: null, expiresAt: { $gt: now } },
    { $set: { revokedAt: now, revokedReason: "rotated" } },
  );

  if (claimed) {
    if (String(claimed.userId) !== jwtUserId) {
      return { ok: false, reason: "invalid" };
    }
    await issueSession(res, jwtUserId, familyOf(claimed));
    return { ok: true };
  }

  const existing = await RefreshSession.findOne({ tokenHash });

  // Unknown, expired, or revoked for a reason other than rotation
  // (sessions revoked before revokedReason existed also land here)
  if (
    !existing ||
    existing.expiresAt <= now ||
    existing.revokedReason !== "rotated" ||
    !existing.revokedAt ||
    String(existing.userId) !== jwtUserId
  ) {
    return { ok: false, reason: "invalid" };
  }

  const familyId = familyOf(existing);
  const rotatedAgoMs = now.getTime() - existing.revokedAt.getTime();

  if (rotatedAgoMs <= reuseGraceMs()) {
    const familyEnded = await RefreshSession.exists({
      familyId,
      revokedReason: { $in: TERMINAL_REASONS },
    });
    if (familyEnded) return { ok: false, reason: "invalid" };

    await issueSession(res, jwtUserId, familyId);
    return { ok: true };
  }

  await RefreshSession.updateMany(
    { familyId, revokedAt: null },
    { $set: { revokedAt: now, revokedReason: "reuse" } },
  );
  console.warn(
    `Refresh token reuse detected; revoked session family ${familyId} for user ${jwtUserId}`,
  );
  return { ok: false, reason: "reuse" };
}

/** Logout: revoke every active session in the presented token's family. */
export async function revokeFamilyByToken(refreshToken: string) {
  const session = await RefreshSession.findOne({
    tokenHash: hashToken(refreshToken),
  });
  if (!session) return;

  const familyId = familyOf(session);
  await RefreshSession.updateMany(
    { $or: [{ familyId }, { _id: session._id }], revokedAt: null },
    { $set: { revokedAt: new Date(), revokedReason: "logout" } },
  );
}

/** Password reset: revoke every active session the user has, on every device. */
export async function revokeAllUserSessions(userId: unknown) {
  await RefreshSession.updateMany(
    { userId, revokedAt: null },
    { $set: { revokedAt: new Date(), revokedReason: "password_reset" } },
  );
}
