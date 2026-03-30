import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InsightsView } from "@/components/insights/insights-view";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Flow analytics, category chromatograph, recurring spend, and heuristic signals — all local.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        title="Insights"
        description="Portfolio-style signal deck: income vs expense flow, category mass, recurring rhythm, and seeded smart narratives. Data from your local ledger only."
      />
      <InsightsView />
    </>
  );
}
