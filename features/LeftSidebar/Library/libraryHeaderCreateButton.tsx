"use client";

import { useRef, useEffect, useState } from "react";
import { Plus, Music2, FolderClosed } from "lucide-react";
import { gsap } from "gsap";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import { addFolder, addPlaylist, selectFilteredItems } from "./libraryslice";
// ─── Options config ───────────────────────────────────────────────────────────

const OPTIONS = [
  {
    type: "playlist" as const,
    label: "Playlist",
    description: "Organize your Songs",
    icon: Music2,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
  },
  {
    type: "folder" as const,
    label: "Folder",
    description: "Organize your Playlists",
    icon: FolderClosed,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];
// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateButton() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const plusRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Plus → X rotation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!plusRef.current) return;
    gsap.to(plusRef.current, {
      rotate: open ? 45 : 0,
      duration: 0.25,
      ease: "power2.inOut",
    });
  }, [open]);

  // ── Dropdown entrance / exit ──────────────────────────────────────────────
  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;

    if (open) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -8, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
      );
    }
  }, [open]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Get Number for the playlist and folders
  const items = useAppSelector(selectFilteredItems);
  const playlistCount = items.filter((item) => item.type === "playlist").length;
  const folderCount = items.filter((item) => item.type === "folder").length;

  // ── Dispatch ──────────────────────────────────────────────────────────────
  const handleSelect = (type: "playlist" | "folder") => {
    const now = new Date().toISOString();
    const itemNumber =
      type === "playlist" ? playlistCount + 1 : folderCount + 1;

    if (type === "playlist") {
      dispatch(
        addPlaylist({
          id: crypto.randomUUID(),
          type: "playlist",
          title: "New Playlist " + itemNumber,
          description: "",
          coverImage: "",
          songIds: [],
          folderId: null,
          ownerId: "local",
          createdAt: now,
          updatedAt: now,
        }),
      );
    } else {
      dispatch(
        addFolder({
          id: crypto.randomUUID(),
          type: "folder",
          title: "New Folder " + itemNumber,
          playlistIds: [],
          ownerId: "local",
          createdAt: now,
          updatedAt: now,
        }),
      );
    }

    console.log("Item added");
    setOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cancel" : "Create"}
        className="bg-white/10 hover:bg-white/20 transition rounded-full p-2 lg:px-4 flex items-center gap-2 text-sm font-medium"
      >
        <Plus ref={plusRef} size={18} />
        <span className="hidden lg:block">{open ? "Cancel" : "Create"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="
          absolute right-0 top-11
            w-56 rounded-xl
            bg-[#1a0a2e] border border-white/10
            shadow-[0_8px_32px_rgba(0,0,0,0.6)]
            overflow-hidden
            z-9999
          "
        >
          {OPTIONS.map(
            ({ type, label, description, icon: Icon, color, bg }) => (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className="
                w-full flex items-center gap-4
                px-4 py-3.5
                hover:bg-white/5 active:bg-white/10
                transition-colors duration-150
                text-left group
              "
              >
                {/* Icon box */}
                <div className={`shrink-0 rounded-lg p-2.5 ${bg}`}>
                  <Icon size={20} className={color} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-white/90">
                    {label}
                  </p>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                    {description}
                  </p>
                </div>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
