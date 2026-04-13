import { describe, expect, it } from "vitest";
import { usersSchema } from "@/features/users/schema/users";

describe("usersSchema", () => {
  it("validates a valid user object", () => {
    const validUser = {
      name: "John Doe",
    };

    const whenResult = usersSchema.safeParse(validUser);

    expect(whenResult.success).toBe(true);
    if (whenResult.success) {
      expect(whenResult.data).toEqual(validUser);
    }
  });

  describe("name field", () => {
    it("rejects name shorter than 3 characters", () => {
      const invalidUser = {
        name: "ab",
      };

      const whenResult = usersSchema.safeParse(invalidUser);

      expect(whenResult.success).toBe(false);
    });

    it("accepts name with exactly 3 characters", () => {
      const validUser = {
        name: "abc",
      };

      const whenResult = usersSchema.safeParse(validUser);

      expect(whenResult.success).toBe(true);
    });

    it("accepts name with exactly 35 characters", () => {
      const validUser = {
        name: "a".repeat(35),
      };

      const whenResult = usersSchema.safeParse(validUser);

      expect(whenResult.success).toBe(true);
    });

    it("rejects name longer than 35 characters", () => {
      const invalidUser = {
        name: "a".repeat(36),
      };

      const whenResult = usersSchema.safeParse(invalidUser);

      expect(whenResult.success).toBe(false);
    });

    it("accepts name with spaces", () => {
      const validUser = {
        name: "John Doe Smith",
      };

      const whenResult = usersSchema.safeParse(validUser);

      expect(whenResult.success).toBe(true);
    });

    it("accepts name with special characters", () => {
      const validUser = {
        name: "O'Brien-Smith",
      };

      const whenResult = usersSchema.safeParse(validUser);

      expect(whenResult.success).toBe(true);
    });

    it("rejects missing name field", () => {
      const invalidUser = {};

      const whenResult = usersSchema.safeParse(invalidUser);

      expect(whenResult.success).toBe(false);
    });

    it("rejects empty name", () => {
      const invalidUser = {
        name: "",
      };

      const whenResult = usersSchema.safeParse(invalidUser);

      expect(whenResult.success).toBe(false);
    });

    it("rejects null name", () => {
      const invalidUser = {
        name: null,
      };

      const whenResult = usersSchema.safeParse(invalidUser);

      expect(whenResult.success).toBe(false);
    });

    it("rejects undefined name", () => {
      const invalidUser = {
        name: undefined,
      };

      const whenResult = usersSchema.safeParse(invalidUser);

      expect(whenResult.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const whenResult = usersSchema.safeParse({});

    expect(whenResult.success).toBe(false);
  });

  it("rejects null value", () => {
    const whenResult = usersSchema.safeParse(null);

    expect(whenResult.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const whenResult = usersSchema.safeParse(undefined);

    expect(whenResult.success).toBe(false);
  });

  it("ignores extra fields not in schema", () => {
    const userWithExtra = {
      name: "John Doe",
      extraField: "should be ignored",
      anotherExtra: 123,
    };

    const whenResult = usersSchema.safeParse(userWithExtra);

    expect(whenResult.success).toBe(true);
    if (whenResult.success) {
      expect(whenResult.data).toEqual({ name: "John Doe" });
      expect(whenResult.data).not.toHaveProperty("extraField");
      expect(whenResult.data).not.toHaveProperty("anotherExtra");
    }
  });
});
