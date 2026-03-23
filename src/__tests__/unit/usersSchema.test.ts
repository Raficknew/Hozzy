import { describe, expect, it } from "vitest";
import { usersSchema } from "@/features/users/schema/users";

describe("usersSchema", () => {
  it("validates a valid user object", () => {
    const validUser = {
      name: "John Doe",
    };

    const result = usersSchema.safeParse(validUser);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validUser);
    }
  });

  describe("name field", () => {
    it("rejects name shorter than 3 characters", () => {
      const invalidUser = {
        name: "ab",
      };

      const result = usersSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });

    it("accepts name with exactly 3 characters", () => {
      const validUser = {
        name: "abc",
      };

      const result = usersSchema.safeParse(validUser);

      expect(result.success).toBe(true);
    });

    it("accepts name with exactly 35 characters", () => {
      const validUser = {
        name: "a".repeat(35),
      };

      const result = usersSchema.safeParse(validUser);

      expect(result.success).toBe(true);
    });

    it("rejects name longer than 35 characters", () => {
      const invalidUser = {
        name: "a".repeat(36),
      };

      const result = usersSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });

    it("accepts name with spaces", () => {
      const validUser = {
        name: "John Doe Smith",
      };

      const result = usersSchema.safeParse(validUser);

      expect(result.success).toBe(true);
    });

    it("accepts name with special characters", () => {
      const validUser = {
        name: "O'Brien-Smith",
      };

      const result = usersSchema.safeParse(validUser);

      expect(result.success).toBe(true);
    });

    it("rejects missing name field", () => {
      const invalidUser = {};

      const result = usersSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      const invalidUser = {
        name: "",
      };

      const result = usersSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });

    it("rejects null name", () => {
      const invalidUser = {
        name: null,
      };

      const result = usersSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });

    it("rejects undefined name", () => {
      const invalidUser = {
        name: undefined,
      };

      const result = usersSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const result = usersSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects null value", () => {
    const result = usersSchema.safeParse(null);

    expect(result.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const result = usersSchema.safeParse(undefined);

    expect(result.success).toBe(false);
  });

  it("ignores extra fields not in schema", () => {
    const userWithExtra = {
      name: "John Doe",
      extraField: "should be ignored",
      anotherExtra: 123,
    };

    const result = usersSchema.safeParse(userWithExtra);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John Doe" });
      expect(result.data).not.toHaveProperty("extraField");
      expect(result.data).not.toHaveProperty("anotherExtra");
    }
  });
});
