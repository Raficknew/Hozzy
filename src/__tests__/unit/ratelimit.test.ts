import { beforeEach, describe, expect, it, vi } from "vitest";

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

    mocks.limitMock.mockReset();
    mocks.limitMock.mockResolvedValue({ remaining: 1 });

    mocks.slidingWindowMock.mockReset();
    mocks.slidingWindowMock.mockReturnValue(mocks.limiterConfigMock);

    mocks.redisFromEnvMock.mockReset();
    mocks.redisFromEnvMock.mockReturnValue(mocks.redisClientMock);

    mocks.RatelimitMock.mockClear();

    ({ assertTransactionsRateLimit } = await import("../../global/ratelimit"));
  });

  it("configures the limiter with 30 requests per minute", () => {
    expect(mocks.redisFromEnvMock).toHaveBeenCalledTimes(1);
    expect(mocks.slidingWindowMock).toHaveBeenCalledWith(30, "1m");
    expect(mocks.RatelimitMock).toHaveBeenCalledWith({
      redis: mocks.redisClientMock,
      limiter: mocks.limiterConfigMock,
    });
  });

  it("returns early when userId is empty", async () => {
    await expect(assertTransactionsRateLimit("")).resolves.toBeUndefined();
    expect(mocks.limitMock).not.toHaveBeenCalled();
  });

  it("does not throw when requests are still available", async () => {
    mocks.limitMock.mockResolvedValueOnce({ remaining: 3 });

    await expect(
      assertTransactionsRateLimit("user-123"),
    ).resolves.toBeUndefined();
    expect(mocks.limitMock).toHaveBeenCalledWith("user-123");
  });

  it("throws RateLimitExceededException when no requests remain", async () => {
    mocks.limitMock.mockResolvedValueOnce({ remaining: 0 });

    await expect(assertTransactionsRateLimit("user-123")).rejects.toThrow(
      "RateLimitExceededException",
    );
    expect(mocks.limitMock).toHaveBeenCalledWith("user-123");
  });
});
