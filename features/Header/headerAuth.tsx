"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, UserPlus, Cloud, LogOut } from "lucide-react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const [profileMenu, setProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileWrapperRef = useRef<HTMLDivElement>(null);

  // ── Dropdown animation ────────────────────────────────────────────────────
  useEffect(() => {
    if (!profileMenuRef.current || !profileMenu) return;
    gsap.fromTo(
      profileMenuRef.current,
      { opacity: 0, y: -12, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" },
    );
  }, [profileMenu]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    if (!profileMenu) return;
    const handler = (e: MouseEvent) => {
      if (!profileWrapperRef.current?.contains(e.target as Node))
        setProfileMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenu]);

  return (
    <div className="flex items-center gap-3">
      {/* ── NOT LOGGED IN ── */}
      {!isAuthenticated && (
        <>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 hover:bg-neutral-200"
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Link>
        </>
      )}

      {/* ── LOGGED IN ── */}
      {isAuthenticated && user && (
        <>
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-105"
          >
            <Cloud className="h-4 w-4" />
            Upload Song
          </Link>

          <div ref={profileWrapperRef} className="relative">
            <button
              onClick={() => setProfileMenu((v) => !v)}
              className="flex items-center gap-2 rounded-full px-1 border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
            >
              {user.coverImage ? (
                <Image
                  src={user.coverImage}
                  alt={user.username}
                  width={38}
                  height={38}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="max-w-30 truncate pr-2 text-sm font-medium text-white">
                {user.username}
              </span>
            </button>

            {profileMenu && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#1a0a2e] py-2 shadow-2xl"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                  onClick={() => setProfileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
