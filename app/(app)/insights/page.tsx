import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InsightsFeed } from "@/components/insights/insights-feed";

export const metadata: Metadata = {
  title: "Insights",
  description: "Narrative insights from mock signals.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        title="Insights"
        description="Asymmetric cards — copy is static mock content."
      />
      <InsightsFeed />
    </>
  );
}
