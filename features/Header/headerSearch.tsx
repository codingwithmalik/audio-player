"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Home } from "lucide-react";
import SearchBar from "../Search/searchBar";


export default function HeaderSearch() {
  const homeIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!homeIconRef.current) return;

    gsap.to(homeIconRef.current, {
      y: -4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    gsap.to(homeIconRef.current, {
      rotate: 8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center gap-3 px-1 sm:px-4">
      {/* Home icon — sits left of the search bar, hidden on mobile */}
      <Link href="/" className="hidden sm:block shrink-0">
        <div
          ref={homeIconRef}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
        >
          <Home className="h-5 w-5" />
        </div>
      </Link>

      <SearchBar />
    </div>
  );
}