import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyRateLimitDefaults } from "@/__tests__/mocks/unit-mocks";

let assertTransactionsRateLimit: (userId: string) => Promise<void>;

const mocks = vi.hoisted(() => {
  const limitMock = vi.fn();
  const slidingWindowMock = vi.fn();
  const redisFromEnvMock = vi.fn();
  const redisClientMock = { type: "mock-redis" };
  const limiterConfigMock = { type: "sliding-window-config" };

  const RatelimitMock = vi.fn().mockImplementation(function (this: {
    limit: typeof limitMock;
  }) {
    this.limit = limitMock;
  });

  Object.assign(RatelimitMock, {
    slidingWindow: slidingWindowMock,
  });

  return {
    limitMock,
    slidingWindowMock,
    redisFromEnvMock,
    redisClientMock,
    limiterConfigMock,
    RatelimitMock,
  };
});

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: mocks.redisFromEnvMock,
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: mocks.RatelimitMock,
}));

describe("assertTransactionsRateLimit", () => {
  beforeEach(async () => {
    vi.resetModules();
    applyRateLimitDefaults(mocks);

    ({ assertTransactionsRateLimit } = await import("../../global/ratelimit"));
  });

  it("configures the limiter with 30 requests per minute on first call", async () => {
    mocks.limitMock.mockResolvedValueOnce({ remaining: 5 });

    await assertTransactionsRateLimit("user-123");

    expect(mocks.redisFromEnvMock).toHaveBeenCalledTimes(1);
    expect(mocks.slidingWindowMock).toHaveBeenCalledWith(30, "1m");
    expect(mocks.RatelimitMock).toHaveBeenCalledWith({
      redis: mocks.redisClientMock,
      limiter: mocks.limiterConfigMock,
    });
  });

  it("returns early when userId is empty", async () => {
    const givenUserId = "";

    const whenApplyingRateLimit = assertTransactionsRateLimit(givenUserId);

    await expect(whenApplyingRateLimit).resolves.toBeUndefined();
    expect(mocks.limitMock).not.toHaveBeenCalled();
  });

  it("does not throw when requests are still available", async () => {
    mocks.limitMock.mockResolvedValueOnce({ remaining: 3 });

    const givenUserId = "user-123";

    const whenApplyingRateLimit = assertTransactionsRateLimit(givenUserId);

    await expect(whenApplyingRateLimit).resolves.toBeUndefined();
    expect(mocks.limitMock).toHaveBeenCalledWith("user-123");
  });

  it("throws RateLimitExceededException when no requests remain", async () => {
    mocks.limitMock.mockResolvedValueOnce({ remaining: 0 });

    const givenUserId = "user-123";

    const whenApplyingRateLimit = assertTransactionsRateLimit(givenUserId);

    await expect(whenApplyingRateLimit).rejects.toThrow(
      "RateLimitExceededException",
    );
    expect(mocks.limitMock).toHaveBeenCalledWith("user-123");
  });
});
