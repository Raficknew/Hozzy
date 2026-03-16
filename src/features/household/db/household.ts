import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { validate as validateUuid } from "uuid";
import { db } from "@/drizzle";
import {
  type CategoriesOfExpanse,
  CategoryTable,
  HouseholdTable,
  InviteTable,
  MembersTable,
  TransactionTable,
} from "@/drizzle/schema";
import { assertHouseholdWriteAccess } from "@/features/household/permissions/household";
import type { HouseholdSchema } from "@/features/household/schema/household";
import { createUuid } from "@/global/functions";
import { auth } from "@/lib/auth";

export async function insertHousehold(
  data: typeof HouseholdTable.$inferInsert,
  balance: number,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Failed while createing Household");

  const [newHousehold] = await db
    .insert(HouseholdTable)
    .values(data)
    .returning();

  if (newHousehold == null) throw new Error("Failed to create household");

  const [newMember] = await db
    .insert(MembersTable)
    .values({
      name: session.user.name!,
      householdId: newHousehold.id,
      userId: newHousehold.ownerId,
    })
    .returning();

  if (newMember == null) throw new Error("Failed to create member for owner");

  const linkId = createUuid();

  const [newInviteLink] = await db
    .insert(InviteTable)
    .values({
      householdId: newHousehold.id,
      link: linkId,
    })
    .returning();

  if (newInviteLink == null) throw new Error("Failed to create invite");

  const t = await getTranslations("DefaultCategories");

  const defaultCategories: {
    name: string;
    icon: string;
    categoryType: CategoriesOfExpanse;
    householdId: string;
  }[] = [
    {
      name: t("rent"),
      icon: "1_rent",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("loan"),
      icon: "2_loan",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("transportation"),
      icon: "3_transportation",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("phone"),
      icon: "4_phone",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("insurence"),
      icon: "5_insurence",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("groceries"),
      icon: "6_groceries",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("healthcare"),
      icon: "7_healthcare",
      categoryType: "fixed",
      householdId: newHousehold.id,
    },
    {
      name: t("clothing"),
      icon: "8_clothing",
      categoryType: "fun",
      householdId: newHousehold.id,
    },
    {
      name: t("eatingOut"),
      icon: "9_eatingOut",
      categoryType: "fun",
      householdId: newHousehold.id,
    },
    {
      name: t("gym"),
      icon: "10_gym",
      categoryType: "fun",
      householdId: newHousehold.id,
    },
    {
      name: t("gifts"),
      icon: "11_gifts",
      categoryType: "fun",
      householdId: newHousehold.id,
    },
    {
      name: t("subscriptions"),
      icon: "12_subscriptions",
      categoryType: "fun",
      householdId: newHousehold.id,
    },
    {
      name: t("coffee"),
      icon: "13_coffee",
      categoryType: "fun",
      householdId: newHousehold.id,
    },
    {
      name: t("emergencyFund"),
      icon: "14_emergencyFund",
      categoryType: "future_you",
      householdId: newHousehold.id,
    },
    {
      name: t("education"),
      icon: "15_education",
      categoryType: "future_you",
      householdId: newHousehold.id,
    },
    {
      name: t("vacationFund"),
      icon: "16_vacationFund",
      categoryType: "future_you",
      householdId: newHousehold.id,
    },
    {
      name: t("dailyJob"),
      icon: "17_dailyJob",
      categoryType: "incomes",
      householdId: newHousehold.id,
    },
    {
      name: t("sideHustle"),
      icon: "18_sideHustle",
      categoryType: "incomes",
      householdId: newHousehold.id,
    },
  ];

  const newCategories = await db
    .insert(CategoryTable)
    .values(defaultCategories)
    .returning();

  if (!newCategories || newCategories.length === 0)
    throw new Error("Failed to create category");

  if (balance > 0) {
    const incomeCategory = newCategories.find(
      (cat) => cat.categoryType === "incomes",
    );

    if (!incomeCategory)
      throw new Error("No income category found for initial transaction");

    const locale = await getLocale();

    const initialTransaction = await db.insert(TransactionTable).values({
      categoryId: incomeCategory.id,
      date: new Date(),
      memberId: newMember.id,
      name: locale === "en" ? "Initial Balance" : "Saldo Początkowe",
      price: balance,
      type: "income",
    });

    if (initialTransaction == null)
      throw new Error("Failed to insert Transaction");
  }

  return newHousehold;
}

export async function updateHousehold(
  data: HouseholdSchema,
  householdId: string,
) {
  if (
    !validateUuid(householdId) ||
    (await assertHouseholdWriteAccess(householdId))
  ) {
    throw new Error("There was an error generateing new link");
  }

  const [updatedHousehold] = await db
    .update(HouseholdTable)
    .set(data)
    .where(eq(HouseholdTable.id, householdId))
    .returning();

  if (updatedHousehold == null)
    throw new Error("Failed to update your Household");

  return updatedHousehold;
}

export async function deleteHousehold(householdId: string) {
  if (
    !validateUuid(householdId) ||
    (await assertHouseholdWriteAccess(householdId))
  ) {
    throw new Error("There was an error generateing new link");
  }

  const [deletedHousehold] = await db
    .delete(HouseholdTable)
    .where(eq(HouseholdTable.id, householdId))
    .returning();

  if (deletedHousehold == null)
    throw new Error("Failed to update your Household");

  return deletedHousehold;
}

export async function updateLink(householdId: string, link: string) {
  if (
    !validateUuid(householdId) ||
    (await assertHouseholdWriteAccess(householdId))
  ) {
    throw new Error("There was an error generateing new link");
  }

  const newLink = await createUuid();

  const [updatedLink] = await db
    .update(InviteTable)
    .set({ link: newLink })
    .where(and(eq(HouseholdTable.id, householdId), eq(InviteTable.link, link)))
    .from(HouseholdTable)
    .returning();

  if (updatedLink == null) throw new Error("Failed to generate link");

  return updatedLink;
}
