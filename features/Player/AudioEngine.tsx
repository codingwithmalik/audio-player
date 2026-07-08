// features/Player/AudioEngine.tsx
"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectCurrentSong,
  selectIsPlaying,
  selectCurrentTime,
  selectIsMuted,
  selectEffectiveVol,
  selectRepeatMode,
  selectIsDraggingProgress,
  setCurrentTime,
  setPlaying,
  setSong,
} from "@/store/playerSlice";
import {
  selectQueueIds,
  selectCurrentIndex,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";

export default function AudioEngine() {
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const song = useAppSelector(selectCurrentSong);
  const isPlaying = useAppSelector(selectIsPlaying);
  const currentTime = useAppSelector(selectCurrentTime);
  const isMuted = useAppSelector(selectIsMuted);
  const effectiveVolume = useAppSelector(selectEffectiveVol);
  const repeatMode = useAppSelector(selectRepeatMode);
  const isDragging = useAppSelector(selectIsDraggingProgress);
  const queueIds = useAppSelector(selectQueueIds);
  const currentIndex = useAppSelector(selectCurrentIndex);

  // ── Create audio element once ─────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // ── Load new song when currentSongId changes ──────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!song?.audioUrl) {
        console.log("Song url"+typeof song?.audioUrl)
      audio.pause();
      audio.src = "";
      return;
    }
    audio.src = song.audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(console.error);
  }, [song?.id]); // only re-run when song ID changes, not isPlaying

  // ── Play / pause ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.audioUrl) return;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ── Volume + mute ─────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = effectiveVolume / 100;
    audio.muted = isMuted;
  }, [effectiveVolume, isMuted]);

  // ── Seek when user drags progress bar ─────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isDragging) return;
    // Only seek if Redux time differs significantly from actual audio time
    // prevents feedback loop between timeupdate and this effect
    if (Math.abs(audio.currentTime - currentTime) > 1.5) {
      audio.currentTime = currentTime;
    }
  }, [currentTime, isDragging]);

  // ── timeupdate → dispatch setCurrentTime ──────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        dispatch(setCurrentTime(Math.floor(audio.currentTime)));
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [dispatch, isDragging]);

  // ── Song ended ────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === "one") {
        // Repeat same song
        audio.currentTime = 0;
        audio.play().catch(console.error);
        dispatch(setCurrentTime(0));
        return;
      }

      if (repeatMode === "all" || currentIndex < queueIds.length - 1) {
        // Play next in queue
        const nextIndex =
          currentIndex + 1 >= queueIds.length
            ? 0 // wrap around for repeat all
            : currentIndex + 1;
        const nextSongId = queueIds[nextIndex];
        if (nextSongId) {
          dispatch(setCurrentIndex(nextIndex));
          dispatch(setSong(nextSongId));
        }
        return;
      }

      // End of queue, no repeat
      dispatch(setPlaying(false));
      dispatch(setCurrentTime(0));
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [dispatch, repeatMode, queueIds, currentIndex]);

  // debugging
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      console.error("Failed to load audio:", audio.error);

      dispatch(setPlaying(false));
      dispatch(setCurrentTime(0));

      // Optional:
      // show a toast
      // skip to next song
    };

    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("error", handleError);
    };
  }, [dispatch]);

  // ── Render nothing ────────────────────────────────────────────────────────
  return null;
}
