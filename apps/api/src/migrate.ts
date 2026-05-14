import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { runMigrations } from "./migrator.js";

async function main() {
  initModels();
  await connectDb();
  await runMigrations();
  // eslint-disable-next-line no-console
  console.log("[migrate] done");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });

