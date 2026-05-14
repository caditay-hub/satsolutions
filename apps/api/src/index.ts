import "dotenv/config";
import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { createServer } from "node:http";
import { connectDb } from "./db.js";
import { getEnv } from "./env.js";
import { runMigrations } from "./migrator.js";
import { initModels } from "./models/index.js";
import { openapi } from "./openapi.js";
import { uploadsDir } from "./paths.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { publicRouter } from "./routes/public.js";
import { createSocketServer } from "./chatSocket.js";

const env = getEnv();

async function main() {
  initModels();
  await connectDb();
  await runMigrations();

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));

  const origins = env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin: origins,
      credentials: false
    })
  );

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(healthRouter);
  app.use(authRouter);
  app.use(publicRouter);

  // Public static files (images)
  app.use("/uploads", express.static(uploadsDir, { maxAge: "365d", immutable: true }));

  // Admin API is mounted under /admin (auth-protected inside router)
  app.use("/admin", adminRouter);

  app.get("/openapi.json", (_req, res) => res.json(openapi));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  const server = createServer(app);
  const io = createSocketServer(server, origins);

  // Store io in app for access in routes
  app.set('io', io);

  console.log("Socket server initialized and stored in app");

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

