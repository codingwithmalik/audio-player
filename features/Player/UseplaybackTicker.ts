// hooks/usePlaybackTicker.ts

"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";

import {
  tick,
  selectIsPlaying,
  selectCurrentTime,
  selectCurrentSong,
  selectRepeatMode,
  setCurrentTime,
} from "@/slices/playerSlice";

export default function usePlaybackTicker() {
  const dispatch = useAppDispatch();

  const isPlaying = useAppSelector(selectIsPlaying);
  const currentSong = useAppSelector(selectCurrentSong);
  const currentTime = useAppSelector(selectCurrentTime);
  const repeatMode = useAppSelector(selectRepeatMode);
  const duration = currentSong?.duration ?? 0

  const tickRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // no song
    if (!currentSong) return;

    // clear previous interval
    if (tickRef.current) {
      clearInterval(tickRef.current);
    }

    // paused
    if (!isPlaying) return;

    tickRef.current = setInterval(() => {
      // repeat one mode
      if (repeatMode === "one" && currentTime >= duration) {
        dispatch(setCurrentTime(0));
        return;
      }

      // normal ticking
      dispatch(tick(duration));
    }, 1000);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
    };
  }, [isPlaying, currentSong, currentTime, repeatMode, dispatch,duration]);
}
