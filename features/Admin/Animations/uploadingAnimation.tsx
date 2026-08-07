"use client";

import { Music2 } from "lucide-react";

type Stage = "idle" | "audio" | "cover" | "saving";

const STAGE_LABELS: Record<Stage, string> = {
  idle: "Preparing...",
  audio: "Uploading audio...",
  cover: "Uploading cover...",
  saving: "Saving song...",
};

export default function UploadingAnimation({
  stage,
  audioProgress,
  coverProgress,
}: {
  stage: Stage;
  audioProgress: number;
  coverProgress: number;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
        <Music2 className="h-7 w-7 text-purple-400" />
      </div>

      <p className="text-sm font-medium text-white">{STAGE_LABELS[stage]}</p>

      <div className="flex w-full flex-col gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-white/50">
            <span>Audio</span>
            <span>
              {stage === "audio"
                ? `${audioProgress}%`
                : stage === "cover" || stage === "saving"
                  ? "100%"
                  : "—"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
              style={{
                width: `${stage === "audio" ? audioProgress : stage === "cover" || stage === "saving" ? 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-white/50">
            <span>Cover</span>
            <span>
              {stage === "cover"
                ? `${coverProgress}%`
                : stage === "saving"
                  ? "100%"
                  : "—"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
              style={{
                width: `${stage === "cover" ? coverProgress : stage === "saving" ? 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
