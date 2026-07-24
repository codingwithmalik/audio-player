// app/profile/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/globalHooks";

const TABS = [
  { label: "Profile", href: "/profile" },
  { label: "Account", href: "/profile/account" },
  { label: "Recents", href: "/profile/recents" },
  { label: "Settings", href: "/profile/settings" },
] as const;

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();

  if (!isAuthenticated) {
    return <ProfileTeaser />;
  }

  return (
    <div className="flex flex-col h-full glass md:rounded-md">
      <nav className="flex gap-6 px-6 border-b border-white/10">
        {TABS.map((tab) => {
          // Settings sub-pages (e.g. /profile/settings/playback) should still
          // highlight the "Settings" tab, so this checks startsWith, not
          // an exact match, for everything except the Profile tab itself
          // (which would otherwise match every route via startsWith("/profile")).
          const isActive =
            tab.href === "/profile"
              ? pathname === "/profile"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

function ProfileTeaser() {
  return (
    <div className="relative h-full md:rounded-md glass">
      {/* Fake content behind the blur — same shapes as the real tabs/header,
          just static placeholders, so the blur implies real substance. */}
      <div className="pointer-events-none select-none blur-sm opacity-60 h-full flex flex-col">
        <nav className="flex gap-6 px-6 border-b border-white/10">
          {TABS.map((tab) => (
            <span
              key={tab.href}
              className="py-4 text-sm font-medium text-white/60"
            >
              {tab.label}
            </span>
          ))}
        </nav>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-40 bg-white/10 rounded" />
              <div className="h-4 w-24 bg-white/10 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-white/10 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Login CTA, centered over the blur */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <p className="text-white text-lg font-semibold">
          Log in to see your profile
        </p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
