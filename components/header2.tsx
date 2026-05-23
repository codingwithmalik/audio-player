"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useAppSelector, useAppDispatch } from "../globalHooks";
import { clearUser } from "../slices/authslice";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#1DB954">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Animated Home Icon ───────────────────────────────────────────────────────

const AnimatedHomeIcon: React.FC = () => {
  const iconRef = useRef<SVGSVGElement>(null);
  const roofRef = useRef<SVGPathElement>(null);
  const windowRef = useRef<SVGRectElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const handleMouseEnter = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      .to(iconRef.current, {
        scale: 1.18,
        duration: 0.2,
        ease: "back.out(2)",
        transformOrigin: "center center",
      })
      .to(roofRef.current, { y: -3, duration: 0.25, ease: "power2.out" }, "<")
      .to(
        windowRef.current,
        { attr: { fill: "#1DB954" }, duration: 0.15 },
        "-=0.1",
      );
  }, []);

  const handleMouseLeave = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      .to(iconRef.current, {
        scale: 1,
        duration: 0.35,
        ease: "elastic.out(1,0.5)",
        transformOrigin: "center center",
      })
      .to(
        roofRef.current,
        { y: 0, duration: 0.35, ease: "elastic.out(1,0.5)" },
        "<",
      )
      .to(
        windowRef.current,
        { attr: { fill: "rgba(30,30,30,0.8)" }, duration: 0.2 },
        "<",
      );
  }, []);

  useEffect(() => {
    if (!iconRef.current) return;
    const pulse = gsap.to(iconRef.current, {
      filter: "drop-shadow(0 0 6px rgba(29,185,84,0.55))",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      pulse.kill();
    };
  }, []);

  return (
    <svg
      ref={iconRef}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="cursor-pointer block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path
        ref={roofRef}
        d="M3 12L12 3L21 12"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12V20C5 20.55 5.45 21 6 21H9V16H15V21H18C18.55 21 19 20.55 19 20V12"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
      <rect
        ref={windowRef}
        x="9.5"
        y="13"
        width="5"
        height="4"
        rx="0.5"
        fill="rgba(30,30,30,0.8)"
      />
    </svg>
  );
};

// ─── Add Song Modal ───────────────────────────────────────────────────────────

interface AddSongModalProps {
  onClose: () => void;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: -14, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.7)" },
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: -8,
      scale: 0.96,
      duration: 0.18,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="bg-[#1e1e1e] rounded-2xl p-8 w-full max-w-[460px] border border-white/[0.08] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-2xl font-extrabold mb-1.5">
          Add a Song
        </h2>
        <p className="text-[#a0a0a0] text-sm mb-7">
          Upload a track to your library
        </p>

        <div className="mb-5">
          <label className="block text-white text-[11px] font-bold uppercase tracking-widest mb-2">
            Song Title
          </label>
          <input
            type="text"
            placeholder="Enter song title"
            className="w-full h-11 bg-[#2a2a2a] border border-white/10 rounded-lg text-white text-sm px-3.5 outline-none focus:border-[#1DB954] transition-colors placeholder:text-[#a0a0a0]"
          />
        </div>

        <div className="mb-5">
          <label className="block text-white text-[11px] font-bold uppercase tracking-widest mb-2">
            Artist
          </label>
          <input
            type="text"
            placeholder="Artist name"
            className="w-full h-11 bg-[#2a2a2a] border border-white/10 rounded-lg text-white text-sm px-3.5 outline-none focus:border-[#1DB954] transition-colors placeholder:text-[#a0a0a0]"
          />
        </div>

        <div className="mb-2">
          <label className="block text-white text-[11px] font-bold uppercase tracking-widest mb-2">
            Audio File
          </label>
          <div className="h-20 bg-[#2a2a2a] border border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#1DB954] transition-colors">
            <span className="text-[#a0a0a0] text-sm">
              Drop your .mp3 or .wav here, or{" "}
              <span className="text-[#1DB954]">browse</span>
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={handleClose}
            className="bg-transparent border border-white/20 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:border-white/50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button className="bg-[#1DB954] text-black text-sm font-bold px-7 py-2.5 rounded-full hover:bg-[#1ed760] hover:scale-[1.03] transition-all cursor-pointer">
            Upload Song
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

interface ProfileDropdownProps {
  username: string;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  username,
  onClose,
  onLogout,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      dropRef.current,
      { opacity: 0, y: -8, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
    );

    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const items = [
    { label: "Profile", action: onClose },
    { label: "Account", action: onClose },
    { label: "Settings", action: onClose },
    { label: "Log out", action: onLogout, danger: true },
  ];

  return (
    <div
      ref={dropRef}
      className="absolute top-[calc(100%+8px)] right-0 bg-[#282828] rounded-lg min-w-[180px] shadow-[0_16px_48px_rgba(0,0,0,0.5)] py-1 z-[2000] border border-white/[0.08]"
    >
      <div className="px-4 pt-3 pb-2.5">
        <span className="text-white font-bold text-sm">{username}</span>
      </div>
      <div className="h-px bg-white/[0.08] mb-1" />
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className={`w-full text-left px-4 py-2.5 text-sm font-medium bg-transparent border-none cursor-pointer transition-all hover:pl-5 hover:bg-white/[0.05] ${
            item.danger
              ? "text-red-400 hover:text-red-300"
              : "text-[#b3b3b3] hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [searchValue, setSearchValue] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const headerRef = useRef<HTMLElement>(null);
  const rightActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  useEffect(() => {
    if (!rightActionsRef.current) return;
    gsap.fromTo(
      Array.from(rightActionsRef.current.children),
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.25, ease: "power2.out" },
    );
  }, [isAuthenticated]);

  const handleLogout = useCallback(() => {
    dispatch(clearUser());
    setShowDropdown(false);
  }, [dispatch]);

  const avatarInitial = user?.username?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <header
        ref={headerRef}
        className="flex items-center justify-between bg-[#121212] px-4 h-16 sticky top-0 z-[1000] border-b border-white/[0.06] gap-3"
      >
        {/* Left — Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <SpotifyLogo />
          </Link>
        </div>

        {/* Center — Home + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-[620px] mx-auto">
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-[#2a2a2a] flex-shrink-0 hover:bg-[#333] transition-colors"
          >
            <AnimatedHomeIcon />
          </Link>

          <div className="relative flex items-center flex-1">
            <span className="absolute left-3.5 text-[#a0a0a0] flex items-center pointer-events-none z-10">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="What do you want to play?"
              aria-label="Search for music"
              className="w-full h-11 bg-[#2a2a2a] border-[1.5px] border-transparent rounded-full text-white text-sm pl-11 pr-11 outline-none focus:border-white/25 focus:bg-[#333] transition-all caret-[#1DB954] placeholder:text-[#a0a0a0]"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                aria-label="Clear search"
                className="absolute right-3.5 text-[#a0a0a0] text-xs hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right — Auth actions */}
        <div
          ref={rightActionsRef}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          {isAuthenticated && user ? (
            <>
              {/* Add Song */}
              <button
                onClick={() => setShowAddModal(true)}
                aria-label="Add a song"
                className="flex items-center gap-1.5 bg-transparent border-[1.5px] border-white/25 text-white text-[13px] font-semibold px-4 py-[7px] rounded-full cursor-pointer hover:border-white hover:bg-white/[0.08] hover:scale-[1.03] transition-all whitespace-nowrap"
              >
                <PlusIcon />
                <span>Add Song</span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-label="Open profile menu"
                  aria-expanded={showDropdown}
                  className="flex items-center gap-2 bg-[#2a2a2a] border-none rounded-full pl-1 pr-3 py-1 cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] text-black flex items-center justify-center text-[13px] font-extrabold flex-shrink-0">
                      {avatarInitial}
                    </div>
                  )}
                  <span className="text-white text-[13px] font-semibold max-w-[90px] truncate">
                    {user.username}
                  </span>
                  <span
                    className={`text-[#a0a0a0] flex items-center transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"}`}
                  >
                    <ChevronDownIcon />
                  </span>
                </button>

                {showDropdown && (
                  <ProfileDropdown
                    username={user.username}
                    onClose={() => setShowDropdown(false)}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="text-[#b3b3b3] no-underline text-sm font-bold tracking-wide px-3 py-2 rounded-full hover:text-white hover:bg-white/[0.07] transition-all whitespace-nowrap"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="bg-white text-[#121212] no-underline text-sm font-bold tracking-wide px-7 py-2.5 rounded-full inline-flex items-center hover:scale-[1.04] hover:bg-[#f0f0f0] transition-all whitespace-nowrap"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </header>

      {showAddModal && <AddSongModal onClose={() => setShowAddModal(false)} />}
    </>
  );
};

export default Header;
