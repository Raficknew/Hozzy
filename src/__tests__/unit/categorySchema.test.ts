import { describe, expect, it } from "vitest";
import { categorySchema } from "@/features/categories/schema/category";

describe("categorySchema", () => {
  it("validates a valid category object", () => {
    const validCategory = {
      name: "Groceries",
      icon: "🛒",
      categoryType: "fixed",
    };

    const result = categorySchema.safeParse(validCategory);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validCategory);
    }
  });

  describe("name field", () => {
    it("rejects name shorter than 3 characters", () => {
      const invalidCategory = {
        name: "ab",
        icon: "🛒",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });

    it("rejects name longer than 20 characters", () => {
      const invalidCategory = {
        name: "a".repeat(21),
        icon: "🛒",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });

    it("accepts name with exactly 3 characters", () => {
      const validCategory = {
        name: "abc",
        icon: "🛒",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(validCategory);

      expect(result.success).toBe(true);
    });

    it("accepts name with exactly 20 characters", () => {
      const validCategory = {
        name: "a".repeat(20),
        icon: "🛒",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(validCategory);

      expect(result.success).toBe(true);
    });

    it("rejects missing name field", () => {
      const invalidCategory = {
        icon: "🛒",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });
  });

  describe("icon field", () => {
    it("rejects empty icon string", () => {
      const invalidCategory = {
        name: "Groceries",
        icon: "",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });

    it("accepts single character icon", () => {
      const validCategory = {
        name: "Groceries",
        icon: "🛒",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(validCategory);

      expect(result.success).toBe(true);
    });

    it("rejects missing icon field", () => {
      const invalidCategory = {
        name: "Groceries",
        categoryType: "fixed",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });
  });

  describe("categoryType field", () => {
    it("rejects empty categoryType string", () => {
      const invalidCategory = {
        name: "Groceries",
        icon: "🛒",
        categoryType: "",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });

    it("accepts valid categoryType values", () => {
      const types = ["fixed", "fun", "future_you", "incomes"];

      for (const type of types) {
        const validCategory = {
          name: "Test",
          icon: "🛒",
          categoryType: type,
        };

        const result = categorySchema.safeParse(validCategory);
        expect(result.success).toBe(true);
      }
    });

    it("rejects missing categoryType field", () => {
      const invalidCategory = {
        name: "Groceries",
        icon: "🛒",
      };

      const result = categorySchema.safeParse(invalidCategory);

      expect(result.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const result = categorySchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects null value", () => {
    const result = categorySchema.safeParse(null);

    expect(result.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const result = categorySchema.safeParse(undefined);

    expect(result.success).toBe(false);
  });
});
