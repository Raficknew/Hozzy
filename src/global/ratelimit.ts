"use server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function assertTransactionsRateLimit(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  if (!userId) return;
  if (process.env.CI) return;

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, "1m"),
  });

  const { remaining } = await ratelimit.limit(userId);

  if (remaining <= 0) {
    throw new Error("RateLimitExceededException");
  }

  return;
}
