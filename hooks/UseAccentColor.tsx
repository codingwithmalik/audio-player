"use client";

/**
 * useAccentColor
 * --------------
 * Calls extractAccentColor when the image URL changes.
 * Returns the derived hex string (or the default while loading).
 *
 * Usage in your page:
 *
 *   const coverUrl = playlist.coverImage ?? songCovers[0]
 *   const accentColor = useAccentColor(coverUrl)
 *
 *   // pass accentColor straight into PlaylistHero — done.
 */

import { useState, useEffect } from "react";
import { extractAccentColor } from "@/utils/extractAccentColor";

const DEFAULT_COLOR = "#8B1A1A";

export function useAccentColor(imageUrl: string | undefined): string {
  const [color, setColor] = useState<string>(DEFAULT_COLOR);

  useEffect(() => {
    if (!imageUrl) {
      setColor(DEFAULT_COLOR);
      return;
    }

    let cancelled = false;

    extractAccentColor(imageUrl).then((result:string) => {
      if (!cancelled) setColor(result);
    });

    // Cleanup: if the playlist changes before the image loads,
    // discard the stale result
    return () => { cancelled = true; };

  }, [imageUrl]);

  return color;
}