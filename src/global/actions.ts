"use server";
import { endOfMonth, startOfMonth } from "date-fns";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { validate as validateUuid } from "uuid";
import { db } from "@/drizzle";
import {
  CategoryTable,
  CurrencyTable,
  HouseholdTable,
  MembersTable,
  TransactionTable,
} from "@/drizzle/schema";

export const getUserHouseholds = async (userId: string) => {
  return db.query.MembersTable.findMany({
    where: eq(MembersTable.userId, userId),
    with: {
      household: {
        columns: { id: true, name: true },
      },
    },
  });
};

export const getHousehold = async (id: string) => {
  if (!(await validateUuid(id))) {
    return null;
  }

  return db.query.HouseholdTable.findFirst({
    where: eq(HouseholdTable.id, id),
    with: {
      currency: { columns: { code: true } },
      invite: { columns: { link: true } },
      members: {
        where: eq(MembersTable.householdId, id),
        with: { user: true },
      },
    },
  });
};

export const getCategoriesWithTransactions = async (
  householdId: string,
  date: Date,
) => {
  if (!validateUuid(householdId) || date == null) {
    return null;
  }

  console.log(date);

  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);

  return db.query.CategoryTable.findMany({
    where: eq(CategoryTable.householdId, householdId),
    with: {
      transactions: {
        where: and(
          gte(TransactionTable.date, firstDayOfMonth),
          lte(TransactionTable.date, lastDayOfMonth),
        ),
      },
    },
  });
};

export const getCurrencies = async () => {
  return db.selectDistinct().from(CurrencyTable);
};

export const getMembers = async (id: string) => {
  return db.query.MembersTable.findMany({
    where: eq(MembersTable.householdId, id),
    columns: { id: true, name: true },
    with: { user: { columns: { id: true, image: true } } },
    orderBy: [asc(MembersTable.createdAt)],
  });
};

export const getCategories = async (id: string) => {
  return db.query.CategoryTable.findMany({
    where: eq(CategoryTable.householdId, id),
    columns: { id: true, name: true, categoryType: true, icon: true },
    orderBy: [asc(CategoryTable.name)],
  });
};
