import { createHmac } from "node:crypto";
import { pool } from "@workspace/db";
import { ipKeyGenerator } from "express-rate-limit";
import type { RequestHandler } from "express";

const limit = 5;

// Exported for real-database concurrency/restart tests. PostgreSQL owns the clock
// and serializes concurrent updates on each key; there is no process-local counter.
export async function consumeEstimateAttempt(key: string) {
  // node-postgres supports per-query timeouts; its QueryConfig type omits them.
  const query = {
    text: `INSERT INTO estimate_rate_limits AS limits (key, hits, reset_at)
      VALUES ($1, 1, statement_timestamp() + interval '15 minutes')
      ON CONFLICT (key) DO UPDATE SET
        hits = CASE WHEN limits.reset_at <= statement_timestamp() THEN 1
          ELSE LEAST(limits.hits + 1, 6) END,
        reset_at = CASE WHEN limits.reset_at <= statement_timestamp()
          THEN statement_timestamp() + interval '15 minutes' ELSE limits.reset_at END
      RETURNING hits, reset_at`,
    values: [key],
    query_timeout: 3000,
  };
  const result = await pool.query<{ hits: number; reset_at: Date }>(query);
  return result.rows[0];
}

export const estimateRateLimit: RequestHandler = async (req, res, next) => {
  try {
    const secret = process.env.RATE_LIMIT_SECRET || process.env.SESSION_SECRET;
    if (!secret || !req.ip) throw new Error("Rate limit configuration missing");
    // Group IPv6 /56 subnets to prevent trivial address rotation. Never trust
    // arbitrary forwarded headers here; req.ip uses Express's proxy policy.
    const key = createHmac("sha256", secret)
      .update(`estimate:${ipKeyGenerator(req.ip)}`).digest("hex");
    const attempt = await consumeEstimateAttempt(key);
    const seconds = Math.max(1, Math.ceil((attempt.reset_at.getTime() - Date.now()) / 1000));
    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Remaining", Math.max(0, limit - attempt.hits));
    res.setHeader("RateLimit-Reset", seconds);
    if (attempt.hits > limit) {
      res.setHeader("Retry-After", seconds);
      res.status(429).json({ error: "Too many requests. Please wait 15 minutes or call (951) 297-0622." });
      return;
    }
    next();
  } catch {
    req.log.error("Estimate rate-limit storage unavailable");
    res.status(503).json({ error: "We couldn’t send your request. Please try again or call (951) 297-0622." });
  }
};

// Bounded retention, independent of server restarts. Only expired counters are
// removed, so running this on several instances cannot reset an active limit.
export async function pruneEstimateLimits() {
  const query = {
    text: "DELETE FROM estimate_rate_limits WHERE reset_at < statement_timestamp() - interval '1 day'",
    query_timeout: 3000,
  };
  await pool.query(query);
}
