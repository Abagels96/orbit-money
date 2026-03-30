import type { Budget } from "@/src/types";

export const budgetsSeed: Budget[] = [
  {
    id: "bdg-01",
    category: "Housing",
    limit: 1900,
    spent: 1850,
  },
  {
    id: "bdg-02",
    category: "Groceries",
    limit: 650,
    spent: 232.3,
  },
  {
    id: "bdg-03",
    category: "Dining",
    limit: 350,
    spent: 74.7,
  },
  {
    id: "bdg-04",
    category: "Transportation",
    limit: 280,
    spent: 129.53,
  },
  {
    id: "bdg-05",
    category: "Entertainment",
    limit: 120,
    spent: 27.98,
  },
  {
    id: "bdg-06",
    category: "Shopping",
    limit: 400,
    spent: 281.65,
  },
];
