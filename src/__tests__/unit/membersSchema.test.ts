import { describe, expect, it } from "vitest";
import { membersSchema } from "@/features/members/schema/members";

describe("membersSchema", () => {
  it("validates a valid member object", () => {
    const validMember = {
      name: "John Doe",
    };

    const result = membersSchema.safeParse(validMember);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validMember);
    }
  });

  describe("name field", () => {
    it("rejects empty name", () => {
      const invalidMember = {
        name: "",
      };

      const result = membersSchema.safeParse(invalidMember);

      expect(result.success).toBe(false);
    });

    it("accepts name with 1 character", () => {
      const validMember = {
        name: "A",
      };

      const result = membersSchema.safeParse(validMember);

      expect(result.success).toBe(true);
    });

    it("accepts name with exactly 35 characters", () => {
      const validMember = {
        name: "a".repeat(35),
      };

      const result = membersSchema.safeParse(validMember);

      expect(result.success).toBe(true);
    });

    it("rejects name longer than 35 characters", () => {
      const invalidMember = {
        name: "a".repeat(36),
      };

      const result = membersSchema.safeParse(invalidMember);

      expect(result.success).toBe(false);
    });

    it("accepts name with spaces", () => {
      const validMember = {
        name: "John Doe Smith",
      };

      const result = membersSchema.safeParse(validMember);

      expect(result.success).toBe(true);
    });

    it("accepts name with special characters", () => {
      const validMember = {
        name: "O'Brien-Smith",
      };

      const result = membersSchema.safeParse(validMember);

      expect(result.success).toBe(true);
    });

    it("rejects missing name field", () => {
      const invalidMember = {};

      const result = membersSchema.safeParse(invalidMember);

      expect(result.success).toBe(false);
    });

    it("rejects null name", () => {
      const invalidMember = {
        name: null,
      };

      const result = membersSchema.safeParse(invalidMember);

      expect(result.success).toBe(false);
    });

    it("rejects undefined name", () => {
      const invalidMember = {
        name: undefined,
      };

      const result = membersSchema.safeParse(invalidMember);

      expect(result.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const result = membersSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects null value", () => {
    const result = membersSchema.safeParse(null);

    expect(result.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const result = membersSchema.safeParse(undefined);

    expect(result.success).toBe(false);
  });

  it("ignores extra fields not in schema", () => {
    const memberWithExtra = {
      name: "John Doe",
      extraField: "should be ignored",
      anotherExtra: 123,
    };

    const result = membersSchema.safeParse(memberWithExtra);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John Doe" });
      expect(result.data).not.toHaveProperty("extraField");
      expect(result.data).not.toHaveProperty("anotherExtra");
    }
  });
});
