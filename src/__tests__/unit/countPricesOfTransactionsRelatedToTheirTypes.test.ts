import { describe, expect, it } from "vitest";
import { countPricesOfTransactionsRelatedToTheirTypes } from "@/global/functions";
import type { CategoryWithTransactions } from "@/global/types";

describe("countPricesOfTransactionsRelatedToTheirTypes", () => {
  it("calculates sums correctly for all category types", () => {
    const categories: CategoryWithTransactions = [
      {
        id: "cat-1",
        name: "Groceries",
        icon: "🛒",
        categoryType: "fixed",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [
          {
            id: "t1",
            name: "Shopping",
            date: new Date("2024-01-15"),
            type: "expense",
            price: 100,
            categoryId: "cat-1",
            memberId: "m1",
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15"),
          },
          {
            id: "t2",
            name: "More shopping",
            date: new Date("2024-01-16"),
            type: "expense",
            price: 50,
            categoryId: "cat-1",
            memberId: "m1",
            createdAt: new Date("2024-01-16"),
            updatedAt: new Date("2024-01-16"),
          },
        ],
      },
      {
        id: "cat-2",
        name: "Entertainment",
        icon: "🎮",
        categoryType: "fun",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [
          {
            id: "t3",
            name: "Movies",
            date: new Date("2024-01-17"),
            type: "expense",
            price: 30,
            categoryId: "cat-2",
            memberId: "m1",
            createdAt: new Date("2024-01-17"),
            updatedAt: new Date("2024-01-17"),
          },
        ],
      },
      {
        id: "cat-3",
        name: "Savings",
        icon: "💰",
        categoryType: "future_you",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [
          {
            id: "t4",
            name: "Investment",
            date: new Date("2024-01-18"),
            type: "expense",
            price: 200,
            categoryId: "cat-3",
            memberId: "m1",
            createdAt: new Date("2024-01-18"),
            updatedAt: new Date("2024-01-18"),
          },
        ],
      },
      {
        id: "cat-4",
        name: "Salary",
        icon: "💵",
        categoryType: "incomes",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [
          {
            id: "t5",
            name: "Monthly salary",
            date: new Date("2024-01-01"),
            type: "income",
            price: 5000,
            categoryId: "cat-4",
            memberId: "m1",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
        ],
      },
    ];

    const result = countPricesOfTransactionsRelatedToTheirTypes(categories);

    expect(result).toEqual({
      fixed: 150,
      fun: 30,
      future_you: 200,
      incomes: 5000,
      balance: 4620,
      totalInExpenses: 380,
    });
  });

  it("returns zeros when categories array is empty", () => {
    const categories: CategoryWithTransactions = [];

    const result = countPricesOfTransactionsRelatedToTheirTypes(categories);

    expect(result).toEqual({
      fixed: 0,
      fun: 0,
      future_you: 0,
      incomes: 0,
      balance: 0,
      totalInExpenses: 0,
    });
  });

  it("handles categories with no transactions", () => {
    const categories: CategoryWithTransactions = [
      {
        id: "cat-1",
        name: "Empty Category",
        icon: "📦",
        categoryType: "fixed",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [],
      },
    ];

    const result = countPricesOfTransactionsRelatedToTheirTypes(categories);

    expect(result).toEqual({
      fixed: 0,
      fun: 0,
      future_you: 0,
      incomes: 0,
      balance: 0,
      totalInExpenses: 0,
    });
  });

  it("calculates negative balance when expenses exceed income", () => {
    const categories: CategoryWithTransactions = [
      {
        id: "cat-1",
        name: "Rent",
        icon: "🏠",
        categoryType: "fixed",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [
          {
            id: "t1",
            name: "Monthly rent",
            date: new Date("2024-01-01"),
            type: "expense",
            price: 2000,
            categoryId: "cat-1",
            memberId: "m1",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
        ],
      },
      {
        id: "cat-2",
        name: "Salary",
        icon: "💵",
        categoryType: "incomes",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        householdId: "house-1",
        transactions: [
          {
            id: "t2",
            name: "Part-time job",
            date: new Date("2024-01-01"),
            type: "income",
            price: 1000,
            categoryId: "cat-2",
            memberId: "m1",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
          },
        ],
      },
    ];

    const result = countPricesOfTransactionsRelatedToTheirTypes(categories);

    expect(result.balance).toBe(-1000);
    expect(result.incomes).toBe(1000);
    expect(result.totalInExpenses).toBe(2000);
  });
});
