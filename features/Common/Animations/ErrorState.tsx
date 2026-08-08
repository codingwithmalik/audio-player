"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  compact = false,
}: {
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${compact ? "py-8" : "py-16"}`}
    >
      <AlertCircle className="h-8 w-8 text-red-400/70" />
      <p className="max-w-xs text-sm text-white/50">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
