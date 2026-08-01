"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectPrivacySettings,
  activatePrivateSession,
  endPrivateSession,
} from "@/features/Profile/settingsSlice";
import ToggleRow from "@/features/Profile/ToggleRow";
import { useUpdateSettingsMutation } from "../settingsApi";

export default function PrivacySettingsPage() {
  const dispatch = useAppDispatch();
  const { privateSession } = useAppSelector(selectPrivacySettings);
  const [updateSettings] = useUpdateSettingsMutation();
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 6);

  return (
    <div className="pl-6 max-w-lg">
      <ToggleRow
        label="Private session"
        description="Temporarily hides your listening activity. Automatically ends after 6 hours."
        checked={privateSession.active}
        onChange={(v) => {
          const privateSession = dispatch(
            v
              ? activatePrivateSession({ expiresAt: expiry.toISOString() })
              : endPrivateSession(),
          );

          updateSettings({
            privacy: {
              privateSession: {
                active: v,
                expiresAt: privateSession.payload?.expiresAt,
              },
            },
          });
        }}
      />
    </div>
  );
}
