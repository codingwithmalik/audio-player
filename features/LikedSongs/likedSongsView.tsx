"use client";

import { useRef, useMemo, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import LikedSongsHero from "./likedSongsHero";
import LikedSongsActions from "./likedSongsActions";
import PlaylistTrackList from "../Playlist/playlistTrackList";
import PlaylistTrackGrid from "../Playlist/playlistTrackGrid";

import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectViewMode,
  selectFilteredSongs,
  resetPlaylistUI,
} from "@/features/Playlist/playlistSlice";
import {
  selectCurrentSongId,
  selectIsPlaying,
  selectSourceId,
  setSong,
  setSourceId,
  setSourceType,
} from "@/store/playerSlice";
import {
  selectLikedSongs,
  selectLikedSongIds,
} from "@/features/LikedSongs/likedSongsSlice";
import { selectSongsByIds } from "@/features/Songs/songsSlice";
import type { RootState } from "@/store/store";
import { selectCurrentUsername } from "../Auth/authSlice";

// ─── Duration formatter ───────────────────────────────────────────────────────

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h} hr ${m} min`;
  if (m > 0) return `${m} min ${s} sec`;
  return `${s} sec`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LikedSongsView() {
  const dispatch = useAppDispatch();
  const likedSongs = useAppSelector(selectLikedSongs);
  const likedSongIds = useAppSelector(selectLikedSongIds);
  const viewMode = useAppSelector(selectViewMode);
  const currentSongId = useAppSelector(selectCurrentSongId) ?? "";
  const isPlaying = useAppSelector(selectIsPlaying);
  const sourceId = useAppSelector(selectSourceId);
  const ownerName = useAppSelector(selectCurrentUsername)

  useEffect(() => {
    if (!likedSongs) return;
    // Reset search/sort/view when navigating to a new playlist
    return () => {
      dispatch(resetPlaylistUI());
    };
  }, [likedSongs, dispatch]);

  // Resolve full Song objects from liked song IDs
  const songs = useAppSelector((state: RootState) =>
    selectSongsByIds(state, likedSongIds),
  );

  // Apply search/sort from playlistSlice UI state (reused for liked songs)
  const filteredSongs = useAppSelector((state) =>
    selectFilteredSongs(state, songs),
  );

  // Total duration
  const totalDurationLabel = useMemo(
    () => formatDuration(songs.reduce((acc, s) => acc + s.duration, 0)),
    [songs],
  );

  // Is liked songs currently the active source
  const isPlaylistPlaying = isPlaying && sourceId === "liked";
  const containerRef = useRef<HTMLDivElement>(null);

  // ── GSAP entrance ─────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const hero = el.querySelector<HTMLElement>("[data-gsap='hero']");
      const actions = el.querySelector<HTMLElement>("[data-gsap='actions']");
      const rows = el.querySelectorAll<HTMLElement>("[data-gsap='track-row']");

      if (!hero || !actions) return;

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
    { scope: containerRef, dependencies: [songs.length] },
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePlaySong = (songId: string) => {
      dispatch(setSourceId("liked"));
      dispatch(setSourceType("liked"));
      dispatch(setSong(songId));
  };
  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="h-full w-full glass rounded-md"
    >
      <div
        ref={containerRef}
        className="min-h-full pb-8"
        style={{
          background:
            "linear-gradient(180deg, #280d5139 0%, transparent 400px)",
        }}
      >
        <div data-gsap="hero">
          <LikedSongsHero
            songCount={songs.length}
            totalDurationLabel={totalDurationLabel}
            ownerName={ownerName}
          />
        </div>

        <div data-gsap="actions">
          <LikedSongsActions
            songs={filteredSongs}
            isPlaying={isPlaylistPlaying}
          />
        </div>

        <div>
          {filteredSongs.length === 0 && songs.length > 0 ? (
            <div className="px-6 py-16 text-center text-white/40 text-sm">
              No songs match your search.
            </div>
          ) : songs.length === 0 ? (
            <div className="px-6 py-16 text-center text-white/40 text-sm ">
              Songs you like will appear here.
            </div>
          ) : viewMode === "list" ? (
            <PlaylistTrackList
              songs={filteredSongs}
              playlistSongs={[...likedSongs]}
              currentSongId={currentSongId}
              onPlaySong={handlePlaySong}
              isPlaylistPlaying={isPlaylistPlaying}
            />
          ) : (
            <PlaylistTrackGrid
              filteredSongs={filteredSongs}
              currentSongId={currentSongId}
              onPlaySong={handlePlaySong}
              isPlaylistPlaying={isPlaylistPlaying}
            />
          )}
        </div>
      </div>
    </OverlayScrollbarsComponent>
  );
}
