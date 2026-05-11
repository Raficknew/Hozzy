import { describe, expect, it } from "vitest";
import { transactionsSchema } from "@/features/transactions/schema/transactions";

describe("transactionsSchema", () => {
  it("validates a valid transaction object", () => {
    const validTransaction = {
      price: 100,
      type: "expense",
      name: "Groceries",
      memberId: "member-123",
      date: new Date("2024-01-15"),
      categoryId: "category-456",
    };

    const whenResult = transactionsSchema.safeParse(validTransaction);

    expect(whenResult.success).toBe(true);
    if (whenResult.success) {
      expect(whenResult.data).toEqual(validTransaction);
    }
  });

  describe("price field", () => {
    it("accepts zero price", () => {
      const validTransaction = {
        price: 0,
        type: "expense",
        name: "Free item",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("accepts maximum price of 100000", () => {
      const validTransaction = {
        price: 100000,
        type: "expense",
        name: "Big purchase",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("rejects negative price", () => {
      const invalidTransaction = {
        price: -10,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("rejects price greater than 100000", () => {
      const invalidTransaction = {
        price: 100001,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("coerces string numbers to numbers", () => {
      const validTransaction = {
        price: "500",
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
      if (whenResult.success) {
        expect(whenResult.data.price).toBe(500);
        expect(typeof whenResult.data.price).toBe("number");
      }
    });

    it("accepts decimal prices", () => {
      const validTransaction = {
        price: 99.99,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("rejects missing price field", () => {
      const invalidTransaction = {
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });
  });

  describe("type field", () => {
    it("accepts non-empty type string", () => {
      const types = ["expense", "income"];

      for (const type of types) {
        const validTransaction = {
          price: 100,
          type: type,
          name: "Test",
          memberId: "member-123",
          date: new Date("2024-01-15"),
          categoryId: "category-456",
        };

        const whenResult = transactionsSchema.safeParse(validTransaction);
        expect(whenResult.success).toBe(true);
      }
    });

    it("rejects empty type string", () => {
      const invalidTransaction = {
        price: 100,
        type: "",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("rejects missing type field", () => {
      const invalidTransaction = {
        price: 100,
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });
  });

  describe("name field", () => {
    it("rejects name shorter than 3 characters", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "ab",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("accepts name with exactly 3 characters", () => {
      const validTransaction = {
        price: 100,
        type: "expense",
        name: "abc",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("accepts name with exactly 40 characters", () => {
      const validTransaction = {
        price: 100,
        type: "expense",
        name: "a".repeat(40),
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("rejects name longer than 40 characters", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "a".repeat(41),
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("rejects missing name field", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });
  });

  describe("memberId field", () => {
    it("accepts non-empty memberId", () => {
      const validTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("rejects empty memberId", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("rejects missing memberId field", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });
  });

  describe("date field", () => {
    it("accepts valid Date object", () => {
      const validTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("rejects string date", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: "2024-01-15",
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("rejects missing date field", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });
  });

  describe("categoryId field", () => {
    it("accepts non-empty categoryId", () => {
      const validTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "category-456",
      };

      const whenResult = transactionsSchema.safeParse(validTransaction);

      expect(whenResult.success).toBe(true);
    });

    it("rejects empty categoryId", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
        categoryId: "",
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });

    it("rejects missing categoryId field", () => {
      const invalidTransaction = {
        price: 100,
        type: "expense",
        name: "Test",
        memberId: "member-123",
        date: new Date("2024-01-15"),
      };

      const whenResult = transactionsSchema.safeParse(invalidTransaction);

      expect(whenResult.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const whenResult = transactionsSchema.safeParse({});

    expect(whenResult.success).toBe(false);
  });

  it("rejects null value", () => {
    const whenResult = transactionsSchema.safeParse(null);

    expect(whenResult.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const whenResult = transactionsSchema.safeParse(undefined);

    expect(whenResult.success).toBe(false);
  });
});
