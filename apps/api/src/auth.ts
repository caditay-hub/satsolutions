import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnv } from "./env.js";
import type { User } from "./models/User.js";
import { RefreshToken } from "./models/RefreshToken.js";
import { generateOpaqueToken, hashToken } from "./security/tokens.js";

const env = getEnv();

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export type JwtPayload = {
  sub: string;
  role: string;
  email: string;
};

export function signAccessToken(user: Pick<User, "id" | "role" | "email">) {
  const payload: JwtPayload = { sub: user.id, role: user.role, email: user.email };
  // expiresIn в свежих @types/jsonwebtoken типизирован шаблонным литералом (StringValue),
  // которому простой string не присваивается; env-значение валидно в рантайме — приводим тип.
  const options: jwt.SignOptions = { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export async function issueRefreshToken(userId: string) {
  const token = generateOpaqueToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  const record = await RefreshToken.create({ userId, tokenHash, expiresAt, revokedAt: null, replacedByTokenId: null });
  return { refreshToken: token, refreshTokenId: record.id, expiresAt };
}

