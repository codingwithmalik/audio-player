"use client";

/**
 * PlaylistEditModal
 * -----------------
 * Glass morphism modal for editing playlist details.
 * Uses PlaylistMosaicCover directly — no duplicate cover logic here.
 */

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Playlist } from "@/types/playlist";
import PlaylistMosaicCover from "./playlistMosaicCover";
import { createPortal } from "react-dom";

interface PlaylistEditModalProps {
  playlist: Playlist;
  isOpen: boolean;
  songCovers: string[];
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  onEditCover: () => void;
}

export default function PlaylistEditModal({
  playlist,
  isOpen,
  songCovers,
  onClose,
  onSave,
  onEditCover,
}: PlaylistEditModalProps) {
  const [title, setTitle] = useState(playlist.title);
  const [description, setDescription] = useState(playlist.description ?? "");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync when playlist changes
  useEffect(() => {
    setTitle(playlist.title);
    setDescription(playlist.description ?? "");
  }, [playlist.id, playlist.title, playlist.description]);

  // Focus title on open
  useEffect(() => {
    if (isOpen) setTimeout(() => titleInputRef.current?.focus(), 50);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() });
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80  z-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[90vw] max-w-135 rounded-2xl p-6 bg-[#1a0a2e]
                   shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-purple-600 font-bold text-xl">Edit Details</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/50 hover:text-white transition-colors duration-150
                       w-8 h-8 flex items-center justify-center rounded-full
                       hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-col sm:flex-row flex gap-5">
          {/* Cover — reuses PlaylistMosaicCover, wrapped in a clickable button */}
          <div className="max-sm:w-full flex justify-center">
            <button
              onClick={onEditCover}
              aria-label="Change playlist cover"
              className="relative rounded-lg overflow-hidden shrink-0 shadow-xl
                       w-40 h-40 sm:w-45 sm:h-45
                       group cursor-pointer"
            >
              <PlaylistMosaicCover
                coverImage={playlist.coverImage}
                songCovers={songCovers}
                title={playlist.title}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2
                         bg-black/60 opacity-0 group-hover:opacity-100
                         transition-opacity duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold">
                  Choose photo
                </span>
              </div>
            </button>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white font-medium uppercase tracking-wider">
                Title
              </label>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                maxLength={100}
                placeholder="Playlist name"
                className="w-full bg-white/10 border border-white/15 rounded-lg
                           px-3 py-2.5 text-white text-sm placeholder:text-white/30
                           focus:outline-none focus:border-white/40 focus:bg-white/15
                           transition-colors duration-150"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-white font-medium uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                placeholder="Add an optional description"
                rows={4}
                className="w-full flex-1 bg-white/10 border border-white/15 rounded-lg
                           px-3 py-2.5 text-white text-sm placeholder:text-white/30
                           focus:outline-none focus:border-white/40 focus:bg-white/15
                           transition-colors duration-150 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <div className="w-80">
            {" "}
            <p className="text-white text-[11px] leading-relaxed">
              By proceeding, you confirm you have the right to use this image
              and content.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-8 py-2.5 rounded-full bg-white text-black text-sm font-bold
                       hover:bg-white/90 active:scale-95 transition-all duration-150
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
