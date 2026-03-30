import type { Metadata } from "next";
import { HomeDashboard } from "@/components/dashboard/home-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Asymmetric dashboard with mock data and local preferences.",
};

export default function OverviewPage() {
  return <HomeDashboard />;
}
