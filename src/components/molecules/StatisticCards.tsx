import { getTransactionsForCategory } from "@/global/actions";
import { Card, CardContent } from "../ui/card";

export async function StatisticCards({
  categoryId,
  date,
}: {
  categoryId: string;
  date: Date;
}) {
  const transactions = await getTransactionsForCategory(categoryId, date);

  return (
    <Card className="w-full">
      <CardContent>
        <h2>Statistics for category {categoryId}</h2>
        <StatisticCard
          title="Number of transactions"
          value={transactions.length.toString()}
        />
      </CardContent>
    </Card>
  );
}

function StatisticCard({ title, value }: { title: string; value: string }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}
