import { CategorySelect } from "@/components/molecules/CategorySelect";
import { getCategories } from "@/global/actions";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>;
  searchParams: Promise<{ date: string }>;
}) {
  const [{ householdId }, { date }] = await Promise.all([params, searchParams]);
  const currentDate = date ? new Date(date) : new Date();
  const categories = await getCategories(householdId);
  return (
    <article>
      <h1>Analytics for {householdId}</h1>
      <p>{currentDate.toDateString()}</p>
      <CategorySelect categories={categories} />
    </article>
  );
}
