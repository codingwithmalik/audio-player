"use client";

import { useAppSelector } from "@/globalHooks";
import { selectStorageSettings } from "@/features/Profile/settingsSlice";

export default function StoragePage() {
  const { cacheSizeMb } = useAppSelector(selectStorageSettings);

  async function handleClearCache() {
    // ─── MOCK: replace with real Cache Storage API / IndexedDB clear ───
    alert("Cache cleared (mocked)");
  }

  return (
    <div className="pl-6 max-w-lg">
      <div className="flex items-center justify-between py-4 border-b border-white/5">
        <div>
          <p className="text-sm font-medium">Cache</p>
          <p className="text-xs text-white/50 mt-1">{cacheSizeMb} MB used</p>
        </div>
        <button
          onClick={handleClearCache}
          className="px-4 py-2 rounded-full border border-white/30 text-xs font-semibold hover:bg-white/10"
        >
          Clear cache
        </button>
      </div>
    </div>
  );
}
