"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  rightSlot?: React.ReactNode;
}

export default function SearchBar({
  value,
  onChange,
  onFocus,
  onBlur,
  autoFocus,
  inputRef,
  rightSlot,
}: SearchBarProps) {
  return (
    <div className="group flex h-11 w-full max-w-112.5 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/20">
      <Search className="h-4 w-4 shrink-0 text-neutral-400 sm:h-5 sm:w-5" />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        placeholder="What do you want to play?"
        className="w-full bg-transparent text-sm text-white placeholder:text-neutral-400 focus:outline-none"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="shrink-0 text-neutral-400 hover:text-white transition"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {rightSlot && (
        <>
          <div className="h-6 w-px bg-white/20 shrink-0" />
          {rightSlot}
        </>
      )}
    </div>
  );
}
