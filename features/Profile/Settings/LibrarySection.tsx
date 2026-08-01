"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectLibrarySettings,
  setShowDownloadedSongs,
} from "@/features/Profile/settingsSlice";
import ToggleRow from "@/features/Profile/ToggleRow";
import { useUpdateSettingsMutation } from "@/features/Profile/settingsApi";

export default function LibrarySettingsPage() {
  const dispatch = useAppDispatch();
  const [updateSettings] = useUpdateSettingsMutation();
  const { showDownloadedSongs } = useAppSelector(selectLibrarySettings);

  return (
    <div className="pl-6 max-w-lg">
      <ToggleRow
        label="Show downloaded songs"
        checked={showDownloadedSongs}
        onChange={(v) => {
          dispatch(setShowDownloadedSongs(v));
          updateSettings({ library: { showDownloadedSongs: v } });
        }}
      />
    </div>
  );
}
