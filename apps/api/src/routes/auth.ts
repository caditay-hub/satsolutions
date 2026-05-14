import { Router } from "express";
import { z } from "zod";
import { issueRefreshToken, signAccessToken, verifyPassword } from "../auth.js";
import { User } from "../models/User.js";
import { authRequired, type AuthedRequest } from "../middleware/authMiddleware.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { hashToken } from "../security/tokens.js";
import { writeAudit } from "../audit.js";

export const authRouter = Router();

authRouter.post("/auth/login", async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const { email, password } = parsed.data;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signAccessToken(user);
  const refresh = await issueRefreshToken(user.id);
  await writeAudit({ req, actorUserId: user.id, action: "LOGIN", entityType: "AUTH", entityId: user.id });
  return res.json({
    accessToken: token,
    refreshToken: refresh.refreshToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
});

authRouter.post("/auth/refresh", async (req, res) => {
  const schema = z.object({ refreshToken: z.string().min(20) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const tokenHash = hashToken(parsed.data.refreshToken);
  const existing = await RefreshToken.findOne({ where: { tokenHash } });
  if (!existing) return res.status(401).json({ error: "Invalid refresh token" });
  if (existing.revokedAt) return res.status(401).json({ error: "Refresh token revoked" });
  if (existing.expiresAt.getTime() < Date.now()) return res.status(401).json({ error: "Refresh token expired" });

  // rotate
  const newRefresh = await issueRefreshToken(existing.userId);
  existing.revokedAt = new Date();
  existing.replacedByTokenId = newRefresh.refreshTokenId;
  await existing.save();

  const user = await User.findByPk(existing.userId);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  const accessToken = signAccessToken(user);
  await writeAudit({ req, actorUserId: user.id, action: "REFRESH", entityType: "AUTH", entityId: user.id });
  return res.json({ accessToken, refreshToken: newRefresh.refreshToken });
});

authRouter.post("/auth/logout", async (req, res) => {
  const schema = z.object({ refreshToken: z.string().min(20) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const tokenHash = hashToken(parsed.data.refreshToken);
  const existing = await RefreshToken.findOne({ where: { tokenHash } });
  if (!existing) return res.status(204).send();
  if (!existing.revokedAt) {
    existing.revokedAt = new Date();
    await existing.save();
  }
  await writeAudit({ req, actorUserId: existing.userId, action: "LOGOUT", entityType: "AUTH", entityId: existing.userId });
  return res.status(204).send();
});

authRouter.get("/auth/me", authRequired, async (req: AuthedRequest, res) => {
  const id = req.auth!.sub;
  const user = await User.findByPk(id, { attributes: ["id", "email", "role", "createdAt"] });
  if (!user) return res.status(404).json({ error: "Not found" });
  return res.json({ user });
});

