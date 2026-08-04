"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Music2, Image as ImageIcon, UploadCloud } from "lucide-react";
import { useCreateSongMutation } from "@/features/Songs/songsApi";
import Image from "next/image";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  uploadCover,
  uploadAudio,
  validateAudioFile,
  validateImageFile,
} from "@/utils/mediaUpload";

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

export default function UploadPage() {
  const router = useRouter();
  const [createSong] = useCreateSongMutation();

  const [title, setTitle] = useState("");
  const [artists, setArtists] = useState("");
  const [language, setLanguage] = useState("");
  const [genres, setGenres] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function handleAudioPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateAudioFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setAudioFile(file);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
  }

  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }
    if (!title.trim() || !artists.trim()) {
      toast.error("Title and at least one artist are required");
      return;
    }

    setIsUploading(true);
    try {
      const duration = await getAudioDuration(audioFile);
      const audioUrl = await uploadAudio(audioFile, setAudioProgress);

      let coverImageUrl: string | undefined;
      if (coverFile) {
        const { url } = await uploadCover(coverFile, "covers");
        coverImageUrl = url;
      }

      await createSong({
        title: title.trim(),
        artists: artists
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        audioUrl,
        coverImage: coverImageUrl,
        duration,
        language: language.trim().toLowerCase() || undefined,
        genres: genres
          .split(",")
          .map((g) => g.trim().toLowerCase())
          .filter(Boolean),
      }).unwrap();

      toast.success("Song uploaded successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.error || err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setAudioProgress(0);
      setCoverProgress(0);
    }
  }

  return (
    <OverlayScrollbarsComponent
      className="w-full h-full glass rounded-md"
      options={{
        scrollbars: {
          theme: "os-theme-light",
          autoHide: "leave",
          autoHideDelay: 0,
        },
      }}
      defer
    >
      <div className="mx-auto max-w-xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-white">Upload a song</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Audio picker */}
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-4 text-left transition hover:bg-white/5"
          >
            <Music2 className="h-6 w-6 text-purple-400 shrink-0" />
            <span className="text-sm text-white truncate">
              {audioFile ? audioFile.name : "Choose an audio file (MP3)"}
            </span>
          </button>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioPick}
            className="hidden"
          />

          {/* Cover picker */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-4 text-left transition hover:bg-white/5"
          >
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover preview"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded-lg object-cover shrink-0"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-purple-400 shrink-0" />
            )}
            <span className="text-sm text-white truncate">
              {coverFile ? coverFile.name : "Choose a cover image (optional)"}
            </span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPick}
            className="hidden"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
          <input
            type="text"
            placeholder="Artists (comma separated)"
            value={artists}
            onChange={(e) => setArtists(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
          <input
            type="text"
            placeholder="Language (e.g. hindi, urdu, english)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
          <input
            type="text"
            placeholder="Genres (comma separated)"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />

          {isUploading && (
            <div className="flex flex-col gap-2 text-xs text-neutral-400">
              <div>
                Audio: {audioProgress}%
                <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
              {coverFile && (
                <div>
                  Cover: {coverProgress}%
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all"
                      style={{ width: `${coverProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload song"}
          </button>
        </form>
      </div>
    </OverlayScrollbarsComponent>
  );
}
