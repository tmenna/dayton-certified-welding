import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const app: Express = express();
// Render appends the client address to X-Forwarded-For at its reverse proxy.
if (process.env.SERVE_WEBSITE === "true") app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// API misses must never return the website's HTML.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Replit keeps Vite and the API separate; Render serves both from this process.
if (process.env.SERVE_WEBSITE === "true") {
  const websiteDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../dcw-website/dist/public",
  );
  const indexFile = path.join(websiteDir, "index.html");
  if (!existsSync(indexFile)) {
    throw new Error("Website build is missing. Run pnpm run build:render first.");
  }
  app.use(express.static(websiteDir, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }));
  app.get("/{*page}", (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(indexFile);
  });
}

export default app;
