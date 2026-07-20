"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "audious:panelWidths";
const DEFAULTS = { left: 265, right: 250 };
const MIN = 265;
const MAX = 360;

function clamp(value: number) {
  return Math.min(MAX, Math.max(MIN, value));
}

function loadWidths() {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      left: clamp(parsed.left ?? DEFAULTS.left),
      right: clamp(parsed.right ?? DEFAULTS.right),
    };
  } catch {
    return DEFAULTS;
  }
}

/**
 * Persisted, resizable panel widths (left/right sidebars).
 * Deliberate exception to the app's no-persistence rule — widths are
 * meaningless if they reset every time you resize them.
 */
export function usePanelWidths() {
  const [widths, setWidths] = useState(DEFAULTS);

  // Load from localStorage after mount only — avoids SSR/client mismatch,
  // since localStorage doesn't exist during server render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWidths(loadWidths());
  }, []);

  const adjustLeftWidth = useCallback((deltaX: number) => {
    setWidths((prev) => {
      const next = { ...prev, left: clamp(prev.left + deltaX) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const adjustRightWidth = useCallback((deltaX: number) => {
    setWidths((prev) => {
      // Dragging right shrinks the right panel (space moves toward main),
      // so this one subtracts deltaX instead of adding it.
      const next = { ...prev, right: clamp(prev.right - deltaX) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    leftWidth: widths.left,
    rightWidth: widths.right,
    adjustLeftWidth,
    adjustRightWidth,
  };
}
