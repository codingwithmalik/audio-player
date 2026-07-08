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
import { useAppSelector, useAppDispatch } from "@/globalHooks";

import { Song } from "@/types/song";
import { Playlist } from "@/types/playlist";
import {
  selectViewMode,
  updatePlaylistMeta,
} from "@/features/Playlist/playlistSlice";
import { selectCurrentSongId } from "@/store/playerSlice";
// import { useAccentColor } from "@/hooks/UseAccentColor";

interface PlaylistViewProps {
  playlist: Playlist;
  songs: Song[];
  filteredSongs: Song[];
  totalDurationLabel: string;
  isPlaylistPlaying: boolean;
  onPlaySong: (songId: string, index: number) => void;
}

export default function PlaylistView({
  playlist,
  songs,
  filteredSongs,
  totalDurationLabel,
  isPlaylistPlaying,
  onPlaySong,
}: PlaylistViewProps) {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSongId = useAppSelector(selectCurrentSongId) ?? "";
  const songCovers = songs.slice(0, 4).map((s) => s.coverImage);
  const songCoversStrings = songCovers.filter((c): c is string => Boolean(c));
  const isLikedPlaylist = playlist.id.startsWith("liked-");
  // const accentColor = useAccentColor(playlist?.coverImage, songCovers);
  const accentColor = "#1a0a2e";

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const hero = el.querySelector<HTMLElement>("[data-gsap='hero']");
      const actions = el.querySelector<HTMLElement>("[data-gsap='actions']");
      const rows = el.querySelectorAll<HTMLElement>("[data-gsap='track-row']");

      gsap.set([hero, actions], { opacity: 0, y: 24 });
      gsap.set(rows, { opacity: 0, x: -12 });

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            gsap.set([hero, actions, rows], { clearProps: "transform" });
          },
        })
        .to(hero, { opacity: 1, y: 0, duration: 0.45 })
        .to(actions, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2")
        .to(rows, { opacity: 1, x: 0, duration: 0.25, stagger: 0.03 }, "-=0.1");
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
      dispatch(updatePlaylistMeta({ id: playlist.id, ...data }));
      // TODO: persist to MongoDB when backend is ready
    },
    [dispatch, playlist],
  );

  const handleEditCover = useCallback(() => {
    // TODO: open Cloudinary upload widget
    setIsEditModalOpen(true);
    console.log("edit cover");
  }, []);

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
            songs={filteredSongs}
            playlistSongs={playlist.songs}
            currentSongId={currentSongId}
            onPlaySong={onPlaySong}
            isPlaylistPlaying={isPlaylistPlaying}
          />
        ) : (
          /* Grid view */
          <PlaylistTrackGrid
            filteredSongs={filteredSongs}
            currentSongId={currentSongId}
            onPlaySong={onPlaySong}
            isPlaylistPlaying={isPlaylistPlaying}
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
        />
      )}
    </div>
  );
}
