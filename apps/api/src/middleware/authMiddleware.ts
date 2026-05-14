import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type JwtPayload } from "../auth.js";

export type AuthedRequest = Request & { auth?: JwtPayload };

export function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roles: Array<JwtPayload["role"]>) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}

