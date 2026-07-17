"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectLibrarySettings,
  setShowDownloadedSongs,
} from "@/features/Profile/settingsSlice";
import ToggleRow from "@/features/Profile/ToggleRow";

export default function LibrarySettingsPage() {
  const dispatch = useAppDispatch();
  const { showDownloadedSongs } = useAppSelector(selectLibrarySettings);

  return (
    <div className="pl-6 max-w-lg">
      <ToggleRow
        label="Show downloaded songs"
        checked={showDownloadedSongs}
        onChange={(v) => dispatch(setShowDownloadedSongs(v))}
      />
    </div>
  );
}
