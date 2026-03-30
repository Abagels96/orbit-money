import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsPanels } from "@/components/settings/settings-panels";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Local preferences, mock currency & appearance, data reset, and JSON export.",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Fine-tune the Orbit shell — balances, atmosphere, and mock currency. Reset or export what lives in your browser; nothing leaves the device."
      />
      <SettingsPanels />
    </>
  );
}
