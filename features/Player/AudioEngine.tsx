/* eslint-disable react-hooks/exhaustive-deps */
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
  setVolume,
  toggleMute,
  setBuffering,
} from "@/slices/playerSlice";
import {
  selectQueueIds,
  selectCurrentIndex,
  selectManualQueueIds,
  setCurrentIndex,
  shiftManualQueue,
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
  const manualQueueIds = useAppSelector(selectManualQueueIds);

  const effectiveVolumeRef = useRef(effectiveVolume);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    effectiveVolumeRef.current = effectiveVolume;
  }, [effectiveVolume]);

  // ── Fade helper ────────────────────────────────────────────────────────────
  const FADE_MS = 200;
  const FADE_STEPS = 10;

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeVolume = (from: number, to: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearFade();
    audio.volume = Math.max(0, Math.min(1, from));
    let step = 0;
    fadeIntervalRef.current = setInterval(() => {
      step++;
      const t = step / FADE_STEPS;
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (step >= FADE_STEPS) {
        clearFade();
        audio.volume = Math.max(0, Math.min(1, to));
        onComplete?.();
      }
    }, FADE_MS / FADE_STEPS);
  };

  // ── Add near the top of the component, after the selectors ────────────────
  // Shared next/previous logic — used by both keyboard shortcuts and Media Session
  const playNext = () => {
    if (manualQueueIds.length > 0) {
      const nextSongId = manualQueueIds[0];
      dispatch(shiftManualQueue());
      dispatch(setSong(nextSongId));
    } else if (currentIndex < queueIds.length - 1) {
      const nextIndex = currentIndex + 1;
      dispatch(setCurrentIndex(nextIndex));
      dispatch(setSong(queueIds[nextIndex]));
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      dispatch(setCurrentIndex(previousIndex));
      dispatch(setSong(queueIds[previousIndex]));
    }
  };

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
      audio.pause();
      audio.src = "";
      return;
    }
    audio.src = song.audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(console.error);
    if (isPlaying) {
      audio.volume = 0;
      audio.play().catch(console.error);
      fadeVolume(0, effectiveVolumeRef.current / 100);
    }
  }, [song?.id]); // only re-run when song ID changes, not isPlaying

  // ── Play / pause ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.audioUrl) return;
    if (isPlaying) {
      audio.play().catch(console.error);
      audio.volume = 0;
      audio.play().catch(console.error);
      fadeVolume(0, effectiveVolumeRef.current / 100);
    } else {
      audio.pause();
      fadeVolume(audio.volume, 0, () => {
        audio.pause();
      });
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
      // Media Session position sync — wrapped in try/catch since it throws
      // if duration isn't finite yet (e.g. still loading metadata)
      if (
        "mediaSession" in navigator &&
        audio.duration &&
        isFinite(audio.duration)
      ) {
        try {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate,
            position: audio.currentTime,
          });
        } catch {
          // ignore — non-critical
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [dispatch, isDragging]);

  // ── Buffering state ────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => dispatch(setBuffering(true));
    const handleResumed = () => dispatch(setBuffering(false));

    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handleResumed);
    audio.addEventListener("canplay", handleResumed);

    return () => {
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handleResumed);
      audio.removeEventListener("canplay", handleResumed);
    };
  }, [dispatch]);

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
      // Manual queue ("Add to Queue") always takes priority over the
      // context queue, regardless of repeat mode — it's a temporary
      // detour, not part of what repeat should loop over.
      if (manualQueueIds.length > 0) {
        const nextSongId = manualQueueIds[0];
        dispatch(shiftManualQueue());
        dispatch(setSong(nextSongId));
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
  }, [dispatch, repeatMode, queueIds, currentIndex, manualQueueIds]);

  // debugging
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => {
      console.log("Failed to load audio:", audio.error);

      dispatch(setPlaying(false));
      dispatch(setCurrentTime(0));

      // Optional:
      // show a toast
      // skip to next song
    };
    if (isPlaying) audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("error", handleError);
    };
  }, [dispatch]);

  // Keyboard Shortcuts for app
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond when this tab is active
      if (document.visibilityState !== "visible") return;

      // Ignore typing in inputs/textareas/contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      switch (e.code) {
        case "Space": {
          e.preventDefault();
          dispatch(setPlaying(!isPlaying));
          break;
        }

        case "ArrowLeft": {
          // Ctrl/Cmd + ← = Previous track
          if (e.shiftKey || e.metaKey) {
            e.preventDefault();
            playPrevious();
            return;
          }

          // ← = Seek back 10 seconds
          e.preventDefault();
          audio.currentTime = Math.max(0, audio.currentTime - 5);
          dispatch(setCurrentTime(audio.currentTime));
          break;
        }

        case "ArrowRight": {
          // Ctrl/Cmd + → = Next track
          if (e.shiftKey || e.metaKey) {
            e.preventDefault();

            playNext();
            return;
          }

          // → = Seek forward 10 seconds
          e.preventDefault();
          audio.currentTime = Math.min(
            audio.duration || Infinity,
            audio.currentTime + 5,
          );
          dispatch(setCurrentTime(audio.currentTime));
          break;
        }

        case "KeyM": {
          e.preventDefault();
          dispatch(toggleMute());
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          dispatch(setVolume(Math.min(100, effectiveVolume + 5)));
          break;
        }

        case "ArrowDown": {
          e.preventDefault();
          dispatch(setVolume(Math.max(0, effectiveVolume - 5)));
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    dispatch,
    isPlaying,
    effectiveVolume,
    currentIndex,
    queueIds,
    manualQueueIds,
  ]);

  // Media API
  // ── Media Session: metadata ───────────────────────────────────────────────
  useEffect(() => {
    if (!("mediaSession" in navigator) || !song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artists.join(" , "),
      artwork: song.coverImage
        ? [
            { src: song.coverImage, sizes: "96x96", type: "image/png" },
            { src: song.coverImage, sizes: "256x256", type: "image/png" },
            { src: song.coverImage, sizes: "512x512", type: "image/png" },
          ]
        : [],
    });
  }, [song]);

  // ── Media Session: action handlers ────────────────────────────────────────
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () =>
      dispatch(setPlaying(true)),
    );
    navigator.mediaSession.setActionHandler("pause", () =>
      dispatch(setPlaying(false)),
    );
    navigator.mediaSession.setActionHandler("previoustrack", playPrevious);
    navigator.mediaSession.setActionHandler("nexttrack", playNext);

    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      const skip = details.seekOffset || 5;
      audio.currentTime = Math.max(0, audio.currentTime - skip);
      dispatch(setCurrentTime(audio.currentTime));
    });

    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const audio = audioRef.current;
      if (!audio) return;
      const skip = details.seekOffset || 5;
      audio.currentTime = Math.min(
        audio.duration || Infinity,
        audio.currentTime + skip,
      );
      dispatch(setCurrentTime(audio.currentTime));
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      const audio = audioRef.current;
      if (!audio || details.seekTime == null) return;
      audio.currentTime = details.seekTime;
      dispatch(setCurrentTime(details.seekTime));
    });

    navigator.mediaSession.setActionHandler("stop", () => {
      dispatch(setPlaying(false));
      dispatch(setCurrentTime(0));
    });

    return () => {
      // Clear handlers on unmount to avoid stale closures controlling playback
      [
        "play",
        "pause",
        "previoustrack",
        "nexttrack",
        "seekbackward",
        "seekforward",
        "seekto",
        "stop",
      ].forEach((action) => {
        try {
          navigator.mediaSession.setActionHandler(
            action as MediaSessionAction,
            null,
          );
        } catch {
          // Some actions unsupported in some browsers — safe to ignore
        }
      });
    };
  }, [dispatch, currentIndex, queueIds, manualQueueIds]);

  // ── Media Session: playback state ─────────────────────────────────────────
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  // ── Render nothing ────────────────────────────────────────────────────────
  return null;
}
