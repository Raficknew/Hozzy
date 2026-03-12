import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { HouseholdTable } from "./houseHold";
import { users } from "./user";

export const MembersTable = pgTable("members", {
  id,
  name: text().notNull(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  householdId: uuid()
    .notNull()
    .references(() => HouseholdTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const MembersRelationships = relations(MembersTable, ({ one }) => ({
  user: one(users, {
    fields: [MembersTable.userId],
    references: [users.id],
  }),
  household: one(HouseholdTable, {
    fields: [MembersTable.householdId],
    references: [HouseholdTable.id],
  }),
}));
