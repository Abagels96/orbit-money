import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { BudgetsOverview } from "@/components/budgets/budgets-overview";

export const metadata: Metadata = {
  title: "Budgets",
  description: "Category ceilings and spend — local store only.",
};

export default function BudgetsPage() {
  return (
    <>
      <PageHeader
        title="Budgets"
        description="Edit ceilings and burn inline; data persists in your browser via the finance store."
      />
      <BudgetsOverview />
    </>
  );
}
