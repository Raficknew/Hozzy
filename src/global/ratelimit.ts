"use server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimitForTransactions: Ratelimit | null = null;

function getRateLimiter() {
  if (!ratelimitForTransactions) {
    const redis = Redis.fromEnv();
    ratelimitForTransactions = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(30, "1m"),
    });
  }
  return ratelimitForTransactions;
}

export async function assertTransactionsRateLimit(userId: string) {
  if (!userId) return;
  if (process.env.CI) return;

  const { remaining } = await getRateLimiter().limit(userId);

  if (remaining <= 0) {
    throw new Error("RateLimitExceededException");
  }

  return;
}
