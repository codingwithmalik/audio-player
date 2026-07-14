"use client";

import Link from "next/link";

const COLORS = [
  "bg-purple-700",
  "bg-fuchsia-700",
  "bg-indigo-700",
  "bg-pink-700",
  "bg-violet-700",
  "bg-rose-700",
  "bg-blue-700",
  "bg-purple-900",
];

// Deterministic color per label — same genre/language always gets the same card color.
function colorFor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++)
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length];
}

interface BrowseCardProps {
  label: string;
  type: "genre" | "language";
}

export default function BrowseCard({ label, type }: BrowseCardProps) {
  const display = label.charAt(0).toUpperCase() + label.slice(1);
  return (
    <Link
      href={`/genre/${encodeURIComponent(label)}?type=${type}`}
      className={`relative block h-24 rounded-lg overflow-hidden p-3 ${colorFor(label)} hover:brightness-110 transition-all`}
    >
      <span className="text-lg font-bold text-white">{display}</span>
    </Link>
  );
}
