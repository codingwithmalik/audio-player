"use client";

/**
 * PlaylistView
 * ------------
 * Root composer. Assembles Hero → Actions → TrackList (list or grid).
 * filteredSongs comes from selectFilteredSongs selector in the page — no
 * filter logic lives here.
 */

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import PlaylistHero from "./playlistHero";
import PlaylistActions from "./playlistActions";
import PlaylistTrackList from "./playlistTrackList";
import PlaylistEditModal from "./playlistEditModal";
import PlaylistTrackGrid from "./playlistTrackGrid";
import { useAppSelector } from "@/globalHooks";

import { Song } from "@/types/song";
import { Playlist } from "@/types/playlist";
import { selectViewMode } from "@/features/Playlist/playlistSlice";
import { selectCurrentSongId } from "@/slices/playerSlice";
import { useUpdatePlaylistMutation } from "./playlistsApi";
import { toast } from "sonner";
import { uploadCover } from "@/utils/mediaUpload";

interface PlaylistViewProps {
  playlist: Playlist;
  songs: Song[];
  filteredSongs: Song[];
  totalDurationLabel: string;
  isPlaylistPlaying: boolean;
  isCurrentPlaylist: boolean;
  onPlaySong: (songId: string, index: number) => void;
}

export default function PlaylistView({
  playlist,
  songs,
  filteredSongs,
  totalDurationLabel,
  isPlaylistPlaying,
  isCurrentPlaylist,
  onPlaySong,
}: PlaylistViewProps) {
  const [updatePlaylist, { isLoading: isSavingDetails }] =
    useUpdatePlaylistMutation();
  const viewMode = useAppSelector(selectViewMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const currentSongId = useAppSelector(selectCurrentSongId) ?? "";
  const songCovers = songs.slice(0, 4).map((s) => s.coverImage);
  const songCoversStrings = songCovers.filter((c): c is string => Boolean(c));
  const isLikedPlaylist = playlist.id.startsWith("liked-");
  const accentColor = "#1a0a2e";

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const hero = el.querySelector<HTMLElement>("[data-gsap='hero']");
      const actions = el.querySelector<HTMLElement>("[data-gsap='actions']");
      const rows = el.querySelectorAll<HTMLElement>("[data-gsap='track-row']");

      const fadeUpTargets = [hero, actions].filter(
        (t): t is HTMLElement => !!t,
      );
      const hasRows = rows.length > 0;

      if (fadeUpTargets.length === 0 && !hasRows) return;

      if (fadeUpTargets.length > 0)
        gsap.set(fadeUpTargets, { opacity: 0, y: 24 });
      if (hasRows) gsap.set(rows, { opacity: 0, x: -12 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          if (fadeUpTargets.length > 0)
            gsap.set(fadeUpTargets, { clearProps: "transform" });
          if (hasRows) gsap.set(rows, { clearProps: "transform" });
        },
      });

      if (hero) tl.to(hero, { opacity: 1, y: 0, duration: 0.45 });
      if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
      if (hasRows)
        tl.to(
          rows,
          { opacity: 1, x: 0, duration: 0.25, stagger: 0.03 },
          "-=0.1",
        );
    },
    { scope: containerRef, dependencies: [playlist.id] },
  );
  // ── Edit modal handlers ─────────────────────────────────────────────────────
  const handleEditDetails = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleSaveDetails = useCallback(
    (data: { title: string; description: string }) => {
      if (!playlist) return;
      updatePlaylist({ id: playlist.id, data });
    },
    [playlist, updatePlaylist],
  );

  const handleCoverFile = useCallback(
    async (file: File) => {
      setIsUploadingCover(true);
      try {
        const { url } = await uploadCover(file, "covers");
        await updatePlaylist({
          id: playlist.id,
          data: { coverImage: url },
        }).unwrap();
      } catch {
        toast.error("Failed to update cover");
      } finally {
        setIsUploadingCover(false);
      }
    },
    [playlist.id, updatePlaylist],
  );

  // handleEditCover now just opens the native picker
  const handleEditCover = useCallback(() => {
    coverFileInputRef.current?.click();
    setIsEditModalOpen(true);
  }, []);

  // new handler — fires once the user actually picks a file
  const handleCoverFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // reset so re-picking the same file still fires onChange next time
      if (!file) return;
      await handleCoverFile(file);
    },
    [handleCoverFile],
  );

  return (
    <div
      ref={containerRef}
      className="min-h-full"
      style={{
        background: `linear-gradient(180deg, ${accentColor}22 0%, transparent 400px)`,
      }}
    >
      <div data-gsap="hero">
        <PlaylistHero
          playlist={playlist}
          songCount={playlist.songs.length}
          totalDurationLabel={totalDurationLabel}
          songCovers={songCovers}
          accentColor={accentColor}
          onEditDetails={handleEditDetails}
          onEditCover={handleEditCover}
          isLikedPlaylist={isLikedPlaylist}
        />
      </div>
      <div data-gsap="actions">
        <PlaylistActions
          songs={filteredSongs}
          isPlaying={isPlaylistPlaying}
          onEditDetails={handleEditDetails}
          playlist={playlist}
          isLikedPlaylist={isLikedPlaylist}
        />
      </div>
      <div className="pb-8">
        {viewMode === "list" ? (
          <PlaylistTrackList
            playlistId={playlist.id}
            songs={filteredSongs}
            playlistSongs={playlist.songs}
            currentSongId={currentSongId}
            onPlaySong={onPlaySong}
            isPlaylistPlaying={isPlaylistPlaying}
            isCurrentPlaylist={isCurrentPlaylist}
          />
        ) : (
          /* Grid view */
          <PlaylistTrackGrid
            playlistId={playlist.id}
            playlistSongs={playlist.songs}
            filteredSongs={filteredSongs}
            currentSongId={currentSongId}
            onPlaySong={onPlaySong}
            isPlaylistPlaying={isPlaylistPlaying}
            isCurrentPlaylist={isCurrentPlaylist}
          />
        )}

        {/* Empty search result */}
        {filteredSongs.length === 0 && songs.length > 0 && (
          <div className="px-6 py-16 text-center text-white/40 text-sm">
            No songs match your search.
          </div>
        )}
      </div>
      {!isLikedPlaylist && isEditModalOpen && (
        <PlaylistEditModal
          playlist={playlist}
          isOpen={isEditModalOpen}
          songCovers={songCoversStrings}
          onClose={handleCloseEditModal}
          onSave={handleSaveDetails}
          onEditCover={handleEditCover}
          isSaving={isSavingDetails}
          isUploadingCover={isUploadingCover}
        />
      )}
      <input
        ref={coverFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverFileSelected}
      />
    </div>
  );
}
