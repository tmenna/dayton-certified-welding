import app from "./app";
import { logger } from "./lib/logger";
import { pruneEstimateLimits } from "./lib/estimate-rate-limit";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

const prune = () => {
  void pruneEstimateLimits().catch(() => logger.warn("Expired estimate counters could not be pruned"));
};
prune();
setInterval(prune, 60 * 60 * 1000).unref();
