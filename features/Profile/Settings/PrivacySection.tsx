"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectPrivacySettings,
  activatePrivateSession,
  endPrivateSession,
} from "@/features/Profile/settingsSlice";
import ToggleRow from "@/features/Profile/ToggleRow";

export default function PrivacySettingsPage() {
  const dispatch = useAppDispatch();
  const { privateSession, } = useAppSelector(
    selectPrivacySettings,
  );

  return (
    <div className="pl-6 max-w-lg">
      <ToggleRow
        label="Private session"
        description="Temporarily hides your listening activity. Automatically ends after 6 hours."
        checked={privateSession.active}
        onChange={(v) =>
          dispatch(v ? activatePrivateSession() : endPrivateSession())
        }
      />
    </div>
  );
}
