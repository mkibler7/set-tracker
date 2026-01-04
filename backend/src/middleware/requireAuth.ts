import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export type AuthUser = { userId: string };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("Authorization") ?? "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      sub: string;
    };

    req.user = { userId: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
