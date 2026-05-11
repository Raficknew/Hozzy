import { z } from "zod";

export const householdSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().max(30),
  currencyCode: z.string().length(3),
  balance: z.coerce.number<number>().min(0),
});

export type HouseholdSchema = z.infer<typeof householdSchema>;
