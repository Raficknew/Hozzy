export type Prices = {
  fixed: number;
  fun: number;
  future_you: number;
  incomes: number;
  balance: number;
  totalInExpenses: number;
};

export type CategoryWithTransactions = {
  name: string;
  id: string;
  icon: string;
  categoryType: "fixed" | "fun" | "future_you" | "incomes";
  createdAt: Date;
  updatedAt: Date;
  householdId: string;
  transactions: {
    date: Date;
    name: string;
    categoryId: string;
    id: string;
    type: "income" | "expense";
    price: number;
    memberId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}[];

export type CategoryWithIcon = {
  icon: string;
  id: string;
  name: string;
  categoryType: "fixed" | "fun" | "future_you" | "incomes";
};

export type Category = {
  name: string;
  id: string;
  icon: string;
  categoryType: "fixed" | "fun" | "future_you" | "incomes";
};

export type Member = {
  name: string;
  id: string;
  user: {
    id: string;
    image: string | null;
  } | null;
};

export type Transaction = {
  categoryName: string;
  categoryId: string;
  name: string;
  date: Date;
  type: "income" | "expense";
  price: number;
  id: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
};
