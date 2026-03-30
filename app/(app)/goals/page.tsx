import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { GoalsGrid } from "@/components/goals/goals-grid";

export const metadata: Metadata = {
  title: "Goals",
  description:
    "Savings vectors — targets, progress, and deadlines stored locally in your browser.",
};

export default function GoalsPage() {
  return (
    <>
      <PageHeader
        title="Goals"
        description="Orb-style progress rings for each savings vector. Add, edit, or remove goals — everything persists in local storage."
      />
      <GoalsGrid />
    </>
  );
}
