"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="group flex h-11 w-full max-w-112.5 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/20">
      <Search className="h-4 w-4 shrink-0 text-neutral-400 sm:h-5 sm:w-5" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to play?"
        className="w-full bg-transparent text-sm text-white placeholder:text-neutral-400 focus:outline-none"
      />

      {/* Clear button — only shows when there's input */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="shrink-0 text-neutral-400 hover:text-white transition"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
