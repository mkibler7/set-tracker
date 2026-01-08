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
  const cookieToken = (req.cookies?.at as string | undefined) ?? undefined;
  const header = req.header("Authorization") ?? "";
  const [type, headerToken] = header.split(" ");

  const token =
    cookieToken ?? (type === "Bearer" && headerToken ? headerToken : undefined);

  if (!token) {
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
