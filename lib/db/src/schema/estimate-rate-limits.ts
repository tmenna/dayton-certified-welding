import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const estimateRateLimits = pgTable("estimate_rate_limits", {
  key: text("key").primaryKey(),
  hits: integer("hits").notNull(),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
}, (table) => [index("estimate_rate_limits_reset_idx").on(table.resetAt)]);

export const insertEstimateRateLimitSchema = createInsertSchema(estimateRateLimits);
export type InsertEstimateRateLimit = z.infer<typeof insertEstimateRateLimitSchema>;
export type EstimateRateLimit = typeof estimateRateLimits.$inferSelect;
