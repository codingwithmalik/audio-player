"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Search, Library, Folder, User } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// NAV ITEMS — add / reorder here
// ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: House },
  { label: "Search", href: "/search", icon: Search },
  { label: "Library", href: "/library", icon: Library },
  { label: "Storage", href: "/Storage", icon: Folder },
  { label: "Profile", href: "/profile", icon: User },
];

// ─────────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────────

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
      fixed bottom-0 left-0 right-0 z-50
      h-16 px-2
      bg-black/40 backdrop-blur-2xl
      border-t border-white/8
      shadow-[0_-4px_24px_rgba(0,0,0,0.4)]
    "
    >
      <ul className="flex items-center justify-around h-full w-full">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center justify-center gap-1 w-full h-full"
              >
                {/* Icon */}
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-fuchsia-400" : "text-white/40"
                  }`}
                />

                {/* Label */}
                <span
                  className={`
                  text-[10px] font-medium tracking-wide transition-colors duration-200
                  ${isActive ? "text-fuchsia-400" : "text-white/35"}
                `}
                >
                  {label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-fuchsia-400" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
