import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(30),
  API_PUBLIC_BASE_URL: z.string().default("http://localhost:4000"),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:3001"),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional()
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

