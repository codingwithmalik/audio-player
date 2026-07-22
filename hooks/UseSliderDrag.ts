"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  setCurrentTime,
  setDraggingProgress,
  setVolume,
  setDraggingVolume,
} from "@/slices/playerSlice";

// ─── Core primitive ───────────────────────────────────────────────────────────

/**
 * useSliderDrag
 *
 * The single primitive behind every draggable bar in the player.
 *
 * Given:
 *  - `trackRef`  — a ref pointing at the track <div>
 *  - `onValue`   — callback called with the 0–1 ratio as the user drags
 *  - `isDragging`— current dragging state (drives the pointermove guard)
 *
 * Returns three pointer-event handlers to spread onto the track element.
 *
 * Why pointer capture instead of window listeners?
 *  setPointerCapture routes ALL subsequent pointer events to the element even
 *  when the cursor leaves it, so fast drags never lose tracking. No global
 *  event listeners are attached or torn down — the browser handles routing.
 */
export function useSliderDrag(
  trackRef: React.RefObject<HTMLDivElement>,
  onValue: (ratio: number) => void,
  isDragging: boolean,
) {
  // Keep `onValue` in a ref so the handlers never capture a stale closure.
  // If `onValue` identity changes on re-render, the handlers still call the
  // latest version without needing to be recreated.
  const onValueRef = useRef(onValue);
  useEffect(() => {
    onValueRef.current = onValue;
  }, [onValue]);

  // Converts a raw clientX position into a 0–1 ratio clamped to the track.
  const getRatio = useCallback(
    (clientX: number): number => {
      const el = trackRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    },
    [trackRef],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      onValueRef.current(getRatio(e.clientX));
    },
    [getRatio],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      onValueRef.current(getRatio(e.clientX));
    },
    [isDragging, getRatio],
  );

  // onPointerUp doubles as onPointerCancel — callers spread both.
  const onPointerUp = useCallback((e:React.PointerEvent<HTMLDivElement>) => {
    // nothing needed here; callers dispatch their own "drag ended" action
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp } as const;
}

// ─── Progress (seek) hook ─────────────────────────────────────────────────────

/**
 * useProgressDrag
 *
 * Wraps `useSliderDrag` for the song progress / timeline bar.
 * Dispatches `setCurrentTime` and manages the `isDraggingProgress` flag.
 *
 * @param trackRef  — ref to the track <div>
 * @param duration  — current song duration in seconds
 * @param isDragging — current isDraggingProgress from Redux
 */
export function useProgressDrag(
  trackRef: React.RefObject<HTMLDivElement>,
  duration: number,
  isDragging: boolean,
) {
  const dispatch = useDispatch();

  // Keep duration in a ref so the ratio → seconds calculation always uses the
  // latest value without requiring the callback to be recreated.
  const durationRef = useRef(duration);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const onValue = useCallback(
    (ratio: number) => {
      dispatch(setCurrentTime(Math.floor(ratio * durationRef.current)));
    },
    [dispatch],
  );

  const {
    onPointerDown: baseDown,
    onPointerMove,
    onPointerUp: baseUp,
  } = useSliderDrag(trackRef, onValue, isDragging);

  // Extend pointerDown to also set the dragging flag
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dispatch(setDraggingProgress(true));
      baseDown(e);
    },
    [dispatch, baseDown],
  );

  // Extend pointerUp to clear the dragging flag
  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dispatch(setDraggingProgress(false));
      baseUp(e);
    },
    [dispatch, baseUp],
  );

  return { onPointerDown, onPointerMove, onPointerUp } as const;
}

// ─── Volume hook ──────────────────────────────────────────────────────────────

/**
 * useVolumeDrag
 *
 * Wraps `useSliderDrag` for the volume bar.
 * Dispatches `setVolume` (0–100) and manages the `isDraggingVolume` flag.
 *
 * @param trackRef  — ref to the volume track <div>
 * @param isDragging — current isDraggingVolume from Redux
 */
export function useVolumeDrag(
  trackRef: React.RefObject<HTMLDivElement>,
  isDragging: boolean,
) {
  const dispatch = useDispatch();

  const onValue = useCallback(
    (ratio: number) => {
      dispatch(setVolume(Math.round(ratio * 100)));
    },
    [dispatch],
  );

  const {
    onPointerDown: baseDown,
    onPointerMove,
    onPointerUp: baseUp,
  } = useSliderDrag(trackRef, onValue, isDragging);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dispatch(setDraggingVolume(true));
      baseDown(e);
    },
    [dispatch, baseDown],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dispatch(setDraggingVolume(false));
      baseUp(e);
    },
    [dispatch, baseUp],
  );

  return { onPointerDown, onPointerMove, onPointerUp } as const;
}
