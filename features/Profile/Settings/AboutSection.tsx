"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Support", href: "#" }, // placeholder — no support system yet
];

export default function AboutPage() {
  return (
    <div className="pl-6 max-w-lg">
      <div className="flex items-center justify-between py-3 border-b border-white/5">
        <span className="text-sm">Version</span>
        <span className="text-sm text-white/50">0.1.0</span>
      </div>
      {LINKS.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center justify-between py-3 border-b border-white/5 hover:text-white/80"
        >
          <span className="text-sm">{label}</span>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </Link>
      ))}
    </div>
  );
}
