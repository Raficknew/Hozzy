"use server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  if (!userId) return;
  if (process.env.CI) return;

  const { remaining } = await getRateLimiter().limit(userId);

  if (remaining <= 0) {
    throw new Error("RateLimitExceededException");
  }

  return;
}
