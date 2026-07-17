"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectAudioQualitySettings,
  setStreamingQuality,
} from "@/features/Profile/settingsSlice";
import type { AudioQualityLevel } from "@/features/Profile/types";

const LEVELS: AudioQualityLevel[] = ["automatic", "low", "normal", "high"];

export default function AudioQualityPage() {
  const dispatch = useAppDispatch();
  const { streamingQuality } = useAppSelector(selectAudioQualitySettings);

  return (
    <div className="pl-6 max-w-lg">
      <div className="flex flex-col gap-1">
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => dispatch(setStreamingQuality(level))}
            className="flex items-center justify-between py-3 px-2 rounded hover:bg-white/5 text-left"
          >
            <span className="text-sm capitalize">{level}</span>
            {streamingQuality === level && (
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
