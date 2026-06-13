import { CategorySelect } from "@/components/molecules/CategorySelect";
import { StatisticCards } from "@/components/molecules/StatisticCards";
import { CategoryBarChart } from "@/components/organisms/CategoryBarChart";
import { MembersPieChart } from "@/components/organisms/MembersPieChart";
import {
  getCategories,
  getMembers,
  getTransactionsForCategory,
} from "@/global/actions";

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
  const transactions = await getTransactionsForCategory(
    categoryId,
    currentDate,
  );
  const members = await getMembers(householdId);
  return (
    <main className="flex flex-col gap-4 h-full">
      <article className="flex md:flex-row flex-col gap-4">
        <CategorySelect
          selectedCategoryId={categoryId || null}
          categories={categories}
        />
        <StatisticCards transactions={transactions} />
      </article>
      <article className="flex md:flex-row flex-col gap-4">
        <CategoryBarChart transactions={transactions} />
        <MembersPieChart transactions={transactions} members={members} />
      </article>
    </main>
  );
}
