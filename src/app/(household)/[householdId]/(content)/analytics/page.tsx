import { CategorySelect } from "@/components/molecules/CategorySelect";
import { StatisticCards } from "@/components/molecules/StatisticCards";
import { CategoryBarChart } from "@/components/organisms/CategoryBarChart";
import { getCategories } from "@/global/actions";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>;
  searchParams: Promise<{ date: string; categoryId: string }>;
}) {
  const [{ householdId }, { date, categoryId }] = await Promise.all([
    params,
    searchParams,
  ]);
  const currentDate = date ? new Date(date) : new Date();
  const categories = await getCategories(householdId);
  return (
    <main>
      <article className="flex md:flex-row flex-col gap-4">
        <CategorySelect
          selectedCategoryId={categoryId || null}
          categories={categories}
        />
        <StatisticCards categoryId={categoryId || ""} date={currentDate} />
      </article>
      <article>
        <CategoryBarChart />
      </article>
    </main>
  );
}
