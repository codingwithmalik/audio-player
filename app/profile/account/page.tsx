"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import AccountSection from "@/features/Profile/AccountSection";
import SecurityPrivacySection from "@/features/Profile/SecurityPrivacySection";

export default function AccountPage() {
  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="h-full"
      defer
    >
      <div className="p-6 flex flex-col gap-10">
        <AccountSection />
        <SecurityPrivacySection />
      </div>
    </OverlayScrollbarsComponent>
  );
}