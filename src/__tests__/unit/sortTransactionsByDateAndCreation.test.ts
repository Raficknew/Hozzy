import { describe, expect, it } from "vitest";
import { sortTransactionsByDateAndCreation } from "@/global/functions";
import type { Transaction } from "@/global/types";

describe("sortTransactionsByDateAndCreation", () => {
  it("sorts transactions by date in descending order", () => {
    const transactions: Transaction[] = [
      {
        id: "t1",
        categoryName: "Food",
        categoryId: "c1",
        name: "Lunch",
        date: new Date("2024-01-10"),
        type: "expense",
        price: 20,
        memberId: "m1",
        createdAt: new Date("2024-01-10T10:00:00"),
        updatedAt: new Date("2024-01-10T10:00:00"),
      },
      {
        id: "t2",
        categoryName: "Food",
        categoryId: "c1",
        name: "Dinner",
        date: new Date("2024-01-15"),
        type: "expense",
        price: 30,
        memberId: "m1",
        createdAt: new Date("2024-01-15T18:00:00"),
        updatedAt: new Date("2024-01-15T18:00:00"),
      },
      {
        id: "t3",
        categoryName: "Food",
        categoryId: "c1",
        name: "Breakfast",
        date: new Date("2024-01-05"),
        type: "expense",
        price: 10,
        memberId: "m1",
        createdAt: new Date("2024-01-05T08:00:00"),
        updatedAt: new Date("2024-01-05T08:00:00"),
      },
    ];

    const sorted = sortTransactionsByDateAndCreation(transactions);

    expect(sorted).toHaveLength(3);
    expect(sorted[0]?.id).toBe("t2");
    expect(sorted[1]?.id).toBe("t1");
    expect(sorted[2]?.id).toBe("t3");
  });

  it("sorts by createdAt when dates are the same", () => {
    const transactions: Transaction[] = [
      {
        id: "t1",
        categoryName: "Food",
        categoryId: "c1",
        name: "First",
        date: new Date("2024-01-10"),
        type: "expense",
        price: 20,
        memberId: "m1",
        createdAt: new Date("2024-01-10T10:00:00"),
        updatedAt: new Date("2024-01-10T10:00:00"),
      },
      {
        id: "t2",
        categoryName: "Food",
        categoryId: "c1",
        name: "Second",
        date: new Date("2024-01-10"),
        type: "expense",
        price: 30,
        memberId: "m1",
        createdAt: new Date("2024-01-10T12:00:00"),
        updatedAt: new Date("2024-01-10T12:00:00"),
      },
      {
        id: "t3",
        categoryName: "Food",
        categoryId: "c1",
        name: "Third",
        date: new Date("2024-01-10"),
        type: "expense",
        price: 10,
        memberId: "m1",
        createdAt: new Date("2024-01-10T08:00:00"),
        updatedAt: new Date("2024-01-10T08:00:00"),
      },
    ];

    const sorted = sortTransactionsByDateAndCreation(transactions);

    expect(sorted).toHaveLength(3);
    expect(sorted[0]?.id).toBe("t2");
    expect(sorted[1]?.id).toBe("t1");
    expect(sorted[2]?.id).toBe("t3");
  });

  it("handles empty array", () => {
    const transactions: Transaction[] = [];
    const sorted = sortTransactionsByDateAndCreation(transactions);
    expect(sorted).toEqual([]);
  });

  it("handles single transaction", () => {
    const transactions: Transaction[] = [
      {
        id: "t1",
        categoryName: "Food",
        categoryId: "c1",
        name: "Lunch",
        date: new Date("2024-01-10"),
        type: "expense",
        price: 20,
        memberId: "m1",
        createdAt: new Date("2024-01-10T10:00:00"),
        updatedAt: new Date("2024-01-10T10:00:00"),
      },
    ];

    const sorted = sortTransactionsByDateAndCreation(transactions);
    expect(sorted).toHaveLength(1);
    expect(sorted[0]?.id).toBe("t1");
  });

  it("maintains stable sort for identical dates and creation times", () => {
    const transactions: Transaction[] = [
      {
        id: "t1",
        categoryName: "Food",
        categoryId: "c1",
        name: "First",
        date: new Date("2024-01-10T10:00:00"),
        type: "expense",
        price: 20,
        memberId: "m1",
        createdAt: new Date("2024-01-10T10:00:00"),
        updatedAt: new Date("2024-01-10T10:00:00"),
      },
      {
        id: "t2",
        categoryName: "Food",
        categoryId: "c1",
        name: "Second",
        date: new Date("2024-01-10T10:00:00"),
        type: "expense",
        price: 30,
        memberId: "m1",
        createdAt: new Date("2024-01-10T10:00:00"),
        updatedAt: new Date("2024-01-10T10:00:00"),
      },
    ];

    const sorted = sortTransactionsByDateAndCreation(transactions);
    expect(sorted).toHaveLength(2);
  });
});
