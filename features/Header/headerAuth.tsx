"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  User,
  LogIn,
  UserPlus,
  Settings,
  Heart,
  Clock3,
  UploadCloud,
  LogOut,
  Cloud,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { logout, setUser } from "../Auth/authSlice";
import { folders ,songs, playlists } from "@/lib/mockData";
// import { songs } from "@/lib/mockSongs";
// import { playlists } from "@/lib/mockPlaylists";
import {
  ensureLikedPlaylist,
  upsertPlaylists,
} from "../Playlist/playlistSlice";
import { upsertSongs } from "../Songs/songsSlice";
import { upsertFolders } from "../Folder/folderSlice";

export default function HeaderAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
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

  useEffect(() => {
    // console.log("User signed in now setting the playlists");
    dispatch(upsertFolders(folders));
    dispatch(upsertPlaylists(playlists));
    dispatch(upsertSongs(songs));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileMenu(false);
  };
  const handleLogin = () => {
    const user = {
      id: "user-1",
      username: "codingwmalik",
      email: "codingwithmalik@gmail.com",
      createdAt: new Date().toISOString(),
    };
    dispatch(setUser(user));
    dispatch(ensureLikedPlaylist({ userId: user.id, username: user.username }));
  };
  // console.log(user);

  return (
    <div className="flex items-center gap-3">
      {/* ── NOT LOGGED IN ── */}
      {!isAuthenticated && (
        <>
          <Link
            href="#"
            onClick={handleLogin}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>

          <Link
            href="/signup"
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
          {/* Upload Song */}
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-105"
          >
            <Cloud className="h-4 w-4" />
            Upload Song
          </Link>

          {/* Profile button + dropdown */}
          <div ref={profileWrapperRef} className="relative">
            <button
              onClick={() => setProfileMenu((o) => !o)}
              className="flex items-center gap-3 rounded-full px-3 py-1 border border-white/10 bg-black/30 text-white transition hover:bg-white/10"
            >
              {user.image ? (
                <Image
                  src={user.image}
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
              <span className="max-w-30 truncate text-sm font-medium text-white">
                {user.username}
              </span>
            </button>

            {/* Dropdown */}
            {profileMenu && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 top-14 z-50 w-65 rounded-3xl overflow-hidden border border-white/10 bg-[#1a0a2e] shadow-2xl backdrop-blur-3xl"
              >
                <div className="flex flex-col gap-2 p-3">
                  {/* User info card */}
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.username}
                        width={45}
                        height={45}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.username}
                      </p>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/upload"
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                    >
                      <UploadCloud className="h-4 w-4" />
                      Upload Song
                    </Link>

                    <Link
                      href="/favorites"
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                    >
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>

                    <Link
                      href="/recent"
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                    >
                      <Clock3 className="h-4 w-4" />
                      Recently Played
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

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
  );
}
