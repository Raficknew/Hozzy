import { describe, expect, it } from "vitest";
import { membersSchema } from "@/features/members/schema/members";

describe("membersSchema", () => {
  it("validates a valid member object", () => {
    const validMember = {
      name: "John Doe",
    };

    const whenResult = membersSchema.safeParse(validMember);

    expect(whenResult.success).toBe(true);
    if (whenResult.success) {
      expect(whenResult.data).toEqual(validMember);
    }
  });

  describe("name field", () => {
    it("rejects empty name", () => {
      const invalidMember = {
        name: "",
      };

      const whenResult = membersSchema.safeParse(invalidMember);

      expect(whenResult.success).toBe(false);
    });

    it("accepts name with 1 character", () => {
      const validMember = {
        name: "A",
      };

      const whenResult = membersSchema.safeParse(validMember);

      expect(whenResult.success).toBe(true);
    });

    it("accepts name with exactly 35 characters", () => {
      const validMember = {
        name: "a".repeat(35),
      };

      const whenResult = membersSchema.safeParse(validMember);

      expect(whenResult.success).toBe(true);
    });

    it("rejects name longer than 35 characters", () => {
      const invalidMember = {
        name: "a".repeat(36),
      };

      const whenResult = membersSchema.safeParse(invalidMember);

      expect(whenResult.success).toBe(false);
    });

    it("accepts name with spaces", () => {
      const validMember = {
        name: "John Doe Smith",
      };

      const whenResult = membersSchema.safeParse(validMember);

      expect(whenResult.success).toBe(true);
    });

    it("accepts name with special characters", () => {
      const validMember = {
        name: "O'Brien-Smith",
      };

      const whenResult = membersSchema.safeParse(validMember);

      expect(whenResult.success).toBe(true);
    });

    it("rejects missing name field", () => {
      const invalidMember = {};

      const whenResult = membersSchema.safeParse(invalidMember);

      expect(whenResult.success).toBe(false);
    });

    it("rejects null name", () => {
      const invalidMember = {
        name: null,
      };

      const whenResult = membersSchema.safeParse(invalidMember);

      expect(whenResult.success).toBe(false);
    });

    it("rejects undefined name", () => {
      const invalidMember = {
        name: undefined,
      };

      const whenResult = membersSchema.safeParse(invalidMember);

      expect(whenResult.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const whenResult = membersSchema.safeParse({});

    expect(whenResult.success).toBe(false);
  });

  it("rejects null value", () => {
    const whenResult = membersSchema.safeParse(null);

    expect(whenResult.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const whenResult = membersSchema.safeParse(undefined);

    expect(whenResult.success).toBe(false);
  });

  it("ignores extra fields not in schema", () => {
    const memberWithExtra = {
      name: "John Doe",
      extraField: "should be ignored",
      anotherExtra: 123,
    };

    const whenResult = membersSchema.safeParse(memberWithExtra);

    expect(whenResult.success).toBe(true);
    if (whenResult.success) {
      expect(whenResult.data).toEqual({ name: "John Doe" });
      expect(whenResult.data).not.toHaveProperty("extraField");
      expect(whenResult.data).not.toHaveProperty("anotherExtra");
    }
  });
});
