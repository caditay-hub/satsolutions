import "dotenv/config";
import { z } from "zod";
import { connectDb } from "./db.js";
import { getEnv } from "./env.js";
import { hashPassword } from "./auth.js";
import { initModels } from "./models/index.js";
import { User } from "./models/User.js";
import { runMigrations } from "./migrator.js";

async function main() {
  initModels();
  await connectDb();
  await runMigrations();

  const env = getEnv();
  const email = env.SEED_ADMIN_EMAIL ?? "admin@satsolutions.local";
  const password = env.SEED_ADMIN_PASSWORD ?? "Admin12345!";

  const passCheck = z.string().min(8).safeParse(password);
  if (!passCheck.success) throw new Error("SEED_ADMIN_PASSWORD too short");

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`[seed] admin already exists: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await User.create({ email, passwordHash, role: "ADMIN" });

  // eslint-disable-next-line no-console
  console.log(`[seed] created admin: ${email} / ${password}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });

