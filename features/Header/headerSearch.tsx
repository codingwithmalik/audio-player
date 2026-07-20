"use client";

import Link from "next/link";
import { Grid3x3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Home } from "lucide-react";
import SearchBar from "../Search/searchBar";
import SearchOverlay from "@/features/Search/SearchOverlay";
import { useAppDispatch } from "@/globalHooks";
import { setQuery, clearQuery } from "@/features/Search/searchSlice";
import { useIsMobile } from "@/hooks/useIsMobile";

const DEBOUNCE_MS = 500;

export default function HeaderSearch() {
  const homeIconRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(768);

  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

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

  // Debounced Redux dispatch — input stays snappy, filtering doesn't run every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setQuery(inputValue));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!focused) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-portal-menu]")) return; // click landed in a portaled dropdown — ignore
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [focused]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!focused) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [focused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isMobile) {
      e.target.blur();
      router.push("/search");
      return;
    }
    setFocused(true);
  };

  const handleChange = (val: string) => {
    setInputValue(val);
  };

  const handleClear = () => {
    setInputValue("");
    dispatch(clearQuery());
  };

  return (
    <div className="flex flex-1 items-center justify-center gap-3 px-1 sm:px-4">
      <Link href="/" className="hidden sm:block shrink-0">
        <div
          ref={homeIconRef}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
        >
          <Home className="h-5 w-5" />
        </div>
      </Link>

      <div ref={containerRef} className="relative w-full max-w-112.5">
        <SearchBar
          value={inputValue}
          onChange={(val) => (val === "" ? handleClear() : handleChange(val))}
          onFocus={handleFocus}
          rightSlot={
            <Link
              onClick={() => setFocused(false)}
              href="/genre"
              className="shrink-0 text-neutral-400 hover:text-white transition"
            >
              <Grid3x3 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          }
        />

        {focused && !isMobile && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-lg bg-[#2C0E3B] backdrop-blur-[800px] border border-white/10 shadow-2xl">
            <SearchOverlay variant="dropdown" />
          </div>
        )}
      </div>
    </div>
  );
}
