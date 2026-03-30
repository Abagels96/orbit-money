import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsPanels } from "@/components/settings/settings-panels";

export const metadata: Metadata = {
  title: "Settings",
  description: "Local preferences only.",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Browser-only preferences; no account or cloud sync."
      />
      <SettingsPanels />
    </>
  );
}
