import { describe, expect, it, vi } from "vitest";
import { createUuid } from "@/global/functions";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mocked-uuid-1234"),
}));

describe("createUuid", () => {
  it("returns a UUID string", () => {
    const uuid = createUuid();
    expect(uuid).toBe("mocked-uuid-1234");
    expect(typeof uuid).toBe("string");
  });
});
