"use client";

import { Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import SearchBar from "@/features/Search/searchBar";

export default function AdminTopBar({
  onMenuClick,
  searchQuery,
  onSearchChange,
}: {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-white/10 p-4 sm:p-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onFocus={() => {}}
        />
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:px-4"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Log out</span>
      </button>
    </div>
  );
}
