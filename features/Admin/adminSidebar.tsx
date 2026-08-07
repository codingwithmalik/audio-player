"use client";

import { X, ListMusic, TrendingUp, Flame } from "lucide-react";

export type AdminTab = "all" | "popular" | "trending";

const TABS: { id: AdminTab; label: string; icon: typeof ListMusic }[] = [
  { id: "all", label: "All Songs", icon: ListMusic },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "popular", label: "Popular", icon: Flame },
];

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile backdrop — only rendered while the drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-65 shrink-0 flex-col gap-6 border-r border-white/10 bg-[#150826] p-5 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-white">Audious Admin</h1>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  onClose(); // closes the mobile drawer after picking a tab — no-op on desktop
                }}
                className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
