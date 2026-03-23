import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { user } from "./auth";
import { CategoryTable } from "./category";
import { CurrencyTable } from "./currency";
import { InviteTable } from "./invites";
import { MembersTable } from "./members";

export const HouseholdTable = pgTable("households", {
  id,
  name: text().notNull(),
  description: text(),
  ownerId: text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  currencyCode: text()
    .references(() => CurrencyTable.code, { onDelete: "no action" })
    .notNull(),
  createdAt,
  updatedAt,
});

export const HouseholdRelationships = relations(
  HouseholdTable,
  ({ one, many }) => ({
    members: many(MembersTable),
    categories: many(CategoryTable),
    user: one(user, {
      fields: [HouseholdTable.ownerId],
      references: [user.id],
    }),
    currency: one(CurrencyTable, {
      fields: [HouseholdTable.currencyCode],
      references: [CurrencyTable.code],
    }),
    invite: one(InviteTable),
  }),
);
