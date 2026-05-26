// components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import {
  Search,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  Settings,
  Heart,
  Clock3,
  UploadCloud,
  LogOut,
  Cloud,
} from "lucide-react";

// REDUX
// import { useAppSelector, useAppDispatch } from "../globalHooks";
// import { logout } from "@/redux/features/auth/authSlice";

type UserType = {
  id: string;
  name: string;
  image?: string;
};

export default function Header() {
  // const dispatch = useAppDispatch();

  // GET USER FROM REDUX
  // console.log(user);
  //  =  useAppSelector((state) => state.auth.user) as UserType | null;
  const user: UserType = {
    id: "123",
    name: "John Doe",
    // image: "https://via.placeholder.com/150",
  };

  const homeIconRef = useRef<HTMLDivElement>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  // HOME ICON ANIMATION
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

  // MOBILE MENU ANIMATION
  useEffect(() => {
    if (!mobileMenuRef.current || !mobileMenu) return;

    gsap.fromTo(
      mobileMenuRef.current,
      {
        opacity: 0,
        y: -20,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      },
    );
  }, [mobileMenu]);

  // PROFILE MENU ANIMATION
  useEffect(() => {
    if (!profileMenuRef.current || !profileMenu) return;

    gsap.fromTo(
      profileMenuRef.current,
      {
        opacity: 0,
        y: -12,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      },
    );
  }, [profileMenu]);

  // LOGOUT
  const handleLogout = () => {
    // dispatch(logout());

    console.log("User Logged Out");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-2xl md:rounded-b-2xl">
      <div className="mx-auto flex h-16 w-full max-w-400 items-center justify-between gap-3 px-3 sm:px-5">
        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center bg-white shadow-lg sm:h-11 sm:w-11 rounded-full">
              <Image
                src="/icon.png"
                alt="Logo"
                width={44}
                height={44}
                className="rounded-full"
              />
            </div>
          </Link>
        </div>

        {/* CENTER */}
        <div className="flex flex-1 items-center justify-center gap-3 px-1 sm:px-4">
          {/* HOME ICON */}
          <Link href="/" className="hidden sm:block">
            <div
              ref={homeIconRef}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
                />
              </svg>
            </div>
          </Link>

          {/* SEARCH */}
          <div className="group flex h-11 w-full max-w-112.5 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/20">
            <Search className="h-4 w-4 shrink-0 text-neutral-400 sm:h-5 sm:w-5" />

            <input
              type="text"
              placeholder="What do you want to play?"
              className="w-full bg-transparent text-sm text-white placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* ========================= */}
          {/* USER NOT LOGGED IN */}
          {/* ========================= */}
          {!user && (
            <>
              {/* DESKTOP BUTTONS */}
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 hover:bg-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </div>
                </Link>
              </div>

              {/* MOBILE HAMBURGER */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#171717]/80 text-white backdrop-blur-xl transition hover:bg-[#222] md:hidden"
              >
                {mobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </>
          )}

          {/* ========================= */}
          {/* USER LOGGED IN */}
          {/* ========================= */}
          {user && (
            <>
              {/* ADD SONG */}
              <Link
                href="/upload"
                className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 md:flex"
              >
                <Cloud className="h-4 w-4" />
                Upload Song
              </Link>

              {/* PROFILE BUTTON */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="flex items-center gap-3 rounded-full px-3 py-1 border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={38}
                      height={38}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full ">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}

                  {/* HIDE NAME ON SMALL DEVICES */}
                  <span className="hidden max-w-30 truncate text-sm font-medium text-white md:block">
                    {user.name}
                  </span>
                </button>

                {/* PROFILE DROPDOWN */}
                {profileMenu && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-[-12] top-14 z-50 sm:w-65 overflow-hidden sm:rounded-3xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-3xl w-screen rounded-b-2xl"
                  >
                    <div className="flex flex-col gap-2 p-3">
                      {/* USER INFO */}
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={45}
                            height={45}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full ">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>

                          <p className="text-xs text-neutral-400">
                            Premium Listener
                          </p>
                        </div>
                      </div>

                      {/* MENU ITEMS */}
                      <div className="flex flex-col gap-2">
                        {/* MOBILE ONLY */}
                        <Link
                          href="/upload"
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10 md:hidden"
                        >
                          <UploadCloud className="h-4 w-4" />
                          Upload Song
                        </Link>

                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                        >
                          <Heart className="h-4 w-4" />
                          Favorites
                        </Link>

                        <Link
                          href="/recent"
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                        >
                          <Clock3 className="h-4 w-4" />
                          Recently Played
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>

                        {/* LOGOUT */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/20"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU FOR NON LOGGED USERS */}
      {!user && mobileMenu && (
        <div
          ref={mobileMenuRef}
          className="mx-3 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-3xl md:hidden "
        >
          <div className="flex flex-col gap-3 p-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>

            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
