"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Music2, Image as ImageIcon, Save, UploadCloud, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useCreateSongMutation, useUpdateSongMutation } from "@/features/Songs/songsApi";
import { uploadCover, uploadAudio, validateAudioFile, validateImageFile } from "@/utils/mediaUpload";
import UploadingAnimation from "@/features/Admin/Animations/uploadingAnimation";
import type { Song } from "@/types/song";

interface SongUploadProps {
  isOpen: boolean;
  mode: "create" | "edit";
  song?: Song;
  onClose: () => void;
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(Math.floor(audio.duration));
    };
    audio.onerror = () => reject(new Error("Could not read audio file"));
    audio.src = URL.createObjectURL(file);
  });
}

export default function SongUpload({ isOpen, mode, song, onClose }: SongUploadProps) {
  const [createSong] = useCreateSongMutation();
  const [updateSong] = useUpdateSongMutation();

  const [title, setTitle] = useState("");
  const [artists, setArtists] = useState("");
  const [language, setLanguage] = useState("");
  const [genres, setGenres] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "audio" | "cover" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Reset / prefill every time the modal opens, for whichever song (or none) it's opened with
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setAudioFile(null);
    setCoverFile(null);
    setAudioProgress(0);
    setCoverProgress(0);
    setStage("idle");

    if (mode === "edit" && song) {
      setTitle(song.title);
      setArtists(song.artists.join(", "));
      setLanguage(song.language ?? "");
      setGenres((song.genres ?? []).join(", "));
      setCoverPreview(song.coverImage ?? null);
    } else {
      setTitle("");
      setArtists("");
      setLanguage("");
      setGenres("");
      setCoverPreview(null);
    }
  }, [isOpen, mode, song]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, isSubmitting, onClose]);

  const handleAudioPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateAudioFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setAudioFile(file);
  }, []);

  const handleCoverPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !artists.trim()) {
      setError("Title and at least one artist are required.");
      return;
    }
    if (mode === "create" && !audioFile) {
      setError("Please select an audio file.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data: Partial<Song> & { title: string; artists: string[] } = {
        title: title.trim(),
        artists: artists.split(",").map((a) => a.trim()).filter(Boolean),
        language: language.trim().toLowerCase() || undefined,
        genres: genres.split(",").map((g) => g.trim().toLowerCase()).filter(Boolean),
      };

      if (audioFile) {
        setStage("audio");
        const duration = await getAudioDuration(audioFile);
        data.audioUrl = await uploadAudio(audioFile, setAudioProgress);
        data.duration = duration;
      }

      if (coverFile) {
        setStage("cover");
        const { url } = await uploadCover(coverFile, "covers");
        data.coverImage = url;
      }

      setStage("saving");
      if (mode === "create") {
        await createSong(data).unwrap();
        toast.success("Song uploaded successfully");
      } else if (song) {
        await updateSong({ id: song.id, data }).unwrap();
        toast.success("Song updated successfully");
      }

      onClose();
    } catch (err: any) {
      setError(err?.data?.error || err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setStage("idle");
      setAudioProgress(0);
      setCoverProgress(0);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/80" onClick={() => !isSubmitting && onClose()} />
      <div
        className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2
                   overflow-y-auto rounded-2xl border border-white/10 bg-[#1a0a2e] p-5 shadow-2xl sm:p-6 scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            {mode === "create" ? "Upload a song" : "Edit song"}
          </h2>
          <button
            onClick={() => !isSubmitting && onClose()}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitting ? (
          <UploadingAnimation stage={stage} audioProgress={audioProgress} coverProgress={coverProgress} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "edit" && song && (
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Current audio
                </p>
                <audio controls src={song.audioUrl} className="w-full" />
              </div>
            )}

            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3.5 text-left transition hover:bg-white/5 sm:p-4"
            >
              <Music2 className="h-5 w-5 shrink-0 text-purple-400 sm:h-6 sm:w-6" />
              <span className="truncate text-sm text-white">
                {audioFile ? audioFile.name : mode === "edit" ? "Replace audio file (optional)" : "Choose an audio file"}
              </span>
            </button>
            <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioPick} className="hidden" />

            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3.5 text-left transition hover:bg-white/5 sm:p-4"
            >
              {coverPreview ? (
                <Image src={coverPreview} alt="Cover preview" width={36} height={36} unoptimized className="h-9 w-9 shrink-0 rounded-lg object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 shrink-0 text-purple-400 sm:h-6 sm:w-6" />
              )}
              <span className="truncate text-sm text-white">
                {coverFile ? coverFile.name : mode === "edit" ? "Replace cover image (optional)" : "Choose a cover image (optional)"}
              </span>
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverPick} className="hidden" />

            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50" />
            <input type="text" placeholder="Artists (comma separated)" value={artists} onChange={(e) => setArtists(e.target.value)}
              className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50" />
            <input type="text" placeholder="Language (e.g. hindi, urdu, english)" value={language} onChange={(e) => setLanguage(e.target.value)}
              className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50" />
            <input type="text" placeholder="Genres (comma separated)" value={genres} onChange={(e) => setGenres(e.target.value)}
              className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50" />

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 translate-y-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
              {mode === "create" ? <UploadCloud className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {mode === "create" ? "Upload song" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </>,
    document.body,
  );
}