"use server";
import { endOfMonth, startOfMonth } from "date-fns";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { validate as validateUuid } from "uuid";
import { db } from "@/drizzle";
import {
  CategoryTable,
  CurrencyTable,
  HouseholdTable,
  MembersTable,
  TransactionTable,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";

export const getUserHouseholds = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null || session.user.id !== userId) {
    throw new Error("UnauthorizedException");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  if (!validateUuid(id)) {
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  if (!validateUuid(householdId) || date == null) {
    return null;
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  return db.selectDistinct().from(CurrencyTable);
};

export const getMembers = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  return db.query.MembersTable.findMany({
    where: eq(MembersTable.householdId, id),
    columns: { id: true, name: true },
    with: { user: { columns: { id: true, image: true } } },
    orderBy: [asc(MembersTable.createdAt)],
  });
};

export const getCategories = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  return db.query.CategoryTable.findMany({
    where: eq(CategoryTable.householdId, id),
    columns: { id: true, name: true, categoryType: true, icon: true },
    orderBy: [asc(CategoryTable.name)],
  });
};

export const switchLanguage = async (language: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  const store = await cookies();
  store.set("locale", language);
};

export const getTransactionsForCategory = async (
  categoryId: string,
  date: Date,
) => {
  if (!date || !validateUuid(categoryId)) {
    return [];
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null) {
    throw new Error("UnauthorizedException");
  }

  return db.query.TransactionTable.findMany({
    where: and(
      eq(TransactionTable.categoryId, categoryId),
      gte(TransactionTable.date, startOfMonth(date)),
      lte(TransactionTable.date, endOfMonth(date)),
    ),
  });
};
