import { describe, expect, it } from "vitest";
import { householdSchema } from "@/features/household/schema/household";

describe("householdSchema", () => {
  it("validates a valid household object", () => {
    const validHousehold = {
      name: "Family Budget",
      description: "Our family expenses",
      currencyCode: "USD",
      balance: 1000,
    };

    const result = householdSchema.safeParse(validHousehold);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validHousehold);
    }
  });

  describe("name field", () => {
    it("rejects name shorter than 3 characters", () => {
      const invalidHousehold = {
        name: "ab",
        description: "Test",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });

    it("rejects name longer than 20 characters", () => {
      const invalidHousehold = {
        name: "a".repeat(21),
        description: "Test",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });

    it("accepts name with exactly 3 characters", () => {
      const validHousehold = {
        name: "abc",
        description: "Test",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
    });

    it("accepts name with exactly 20 characters", () => {
      const validHousehold = {
        name: "a".repeat(20),
        description: "Test",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
    });

    it("rejects missing name field", () => {
      const invalidHousehold = {
        description: "Test",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });
  });

  describe("description field", () => {
    it("accepts empty description", () => {
      const validHousehold = {
        name: "Family",
        description: "",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
    });

    it("rejects description longer than 30 characters", () => {
      const invalidHousehold = {
        name: "Family",
        description: "a".repeat(31),
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });

    it("accepts description with exactly 30 characters", () => {
      const validHousehold = {
        name: "Family",
        description: "a".repeat(30),
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
    });

    it("rejects missing description field", () => {
      const invalidHousehold = {
        name: "Family",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });
  });

  describe("currencyCode field", () => {
    it("rejects currencyCode shorter than 3 characters", () => {
      const invalidHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "US",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });

    it("rejects currencyCode longer than 3 characters", () => {
      const invalidHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "USDD",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });

    it("accepts valid 3-character currency codes", () => {
      const currencies = ["USD", "EUR", "CHF", "PLN"];

      for (const currency of currencies) {
        const validHousehold = {
          name: "Family",
          description: "Test",
          currencyCode: currency,
          balance: 0,
        };

        const result = householdSchema.safeParse(validHousehold);
        expect(result.success).toBe(true);
      }
    });

    it("rejects missing currencyCode field", () => {
      const invalidHousehold = {
        name: "Family",
        description: "Test",
        balance: 0,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });
  });

  describe("balance field", () => {
    it("accepts zero balance", () => {
      const validHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "USD",
        balance: 0,
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
    });

    it("accepts positive balance", () => {
      const validHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "USD",
        balance: 5000,
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
    });

    it("rejects negative balance", () => {
      const invalidHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "USD",
        balance: -100,
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });

    it("coerces string numbers to numbers", () => {
      const validHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "USD",
        balance: "1000",
      };

      const result = householdSchema.safeParse(validHousehold);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.balance).toBe(1000);
        expect(typeof result.data.balance).toBe("number");
      }
    });

    it("rejects missing balance field", () => {
      const invalidHousehold = {
        name: "Family",
        description: "Test",
        currencyCode: "USD",
      };

      const result = householdSchema.safeParse(invalidHousehold);

      expect(result.success).toBe(false);
    });
  });

  it("rejects completely empty object", () => {
    const result = householdSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects null value", () => {
    const result = householdSchema.safeParse(null);

    expect(result.success).toBe(false);
  });

  it("rejects undefined value", () => {
    const result = householdSchema.safeParse(undefined);

    expect(result.success).toBe(false);
  });
});
