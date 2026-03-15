import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { user } from "./auth";
import { HouseholdTable } from "./houseHold";

export const MembersTable = pgTable("members", {
  id,
  name: text().notNull(),
  userId: uuid().references(() => user.id, { onDelete: "cascade" }),
  householdId: uuid()
    .notNull()
    .references(() => HouseholdTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const MembersRelationships = relations(MembersTable, ({ one }) => ({
  user: one(user, {
    fields: [MembersTable.userId],
    references: [user.id],
  }),
  household: one(HouseholdTable, {
    fields: [MembersTable.householdId],
    references: [HouseholdTable.id],
  }),
}));
