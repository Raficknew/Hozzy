import { count } from "drizzle-orm";
import { db } from ".";
import { CurrencyTable } from "./schema";

const main = async () => {
  const rows: { count: number }[] = await db
    .select({ count: count() })
    .from(CurrencyTable);

  if ((rows[0]?.count ?? 0) > 0) {
    return;
  }

  const data: (typeof CurrencyTable.$inferInsert)[] = [
    {
      code: "PLN",
    },
    {
      code: "EUR",
    },
    { code: "USD" },
    {
      code: "CHF",
    },
  ];

  console.log("Seed start");
  await db.insert(CurrencyTable).values(data);
  console.log("Seed done");
};

main();
