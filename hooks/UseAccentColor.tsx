"use client";

/**
 * useAccentColor
 * --------------
 * Extracts a dominant accent color from playlist cover or song covers,
 * blends it with the app's dark purple theme, and returns it as a hex string.
 *
 * Priority (mirrors PlaylistMosaicCover logic):
 *   1. playlist.coverImage     → sample single image
 *   2. songCovers[0..3]        → sample all four, blend dominant hues
 *   3. fallback                → DEFAULT_COLOR
 *
 * The extracted color is always forced into a dark saturated range
 * and blended with the app theme purple to stay visually coherent.
 *
 * CORS: image server must send Access-Control-Allow-Origin: *
 */

import { useState, useEffect } from "react";

// ─── Theme constants ──────────────────────────────────────────────────────────

const DEFAULT_COLOR  = "#1a0a2e";  // deep dark purple — app theme fallback
const THEME_PURPLE_H = 270;        // hue of app's fuchsia/purple theme
const THEME_PURPLE_S = 0.6;        // saturation
const THEME_PURPLE_L = 0.12;       // lightness — kept very dark

// How much the extracted color influences the final result (0–1)
// 0.35 = 35% extracted, 65% theme purple
const BLEND_WEIGHT = 0.35;

// Canvas sample size — small enough to be fast
const SAMPLE_SIZE = 40;

// Minimum saturation for a pixel to count as "colorful"
const MIN_SAT = 0.2;
const MIN_LIT = 0.1;
const MAX_LIT = 0.9;

// ─── Color math ───────────────────────────────────────────────────────────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return [0, 0, l];

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if      (max === r) h = ((g - b) / delta + 6) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else                h = (r - g) / delta + 4;

  return [h * 60, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const val = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * val).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Blend two HSL hues using circular averaging (handles the 0/360 wrap).
 * weight: 0 = all hue1, 1 = all hue2
 */
function blendHues(hue1: number, hue2: number, weight: number): number {
  // Convert to radians for circular mean
  const r1 = (hue1 * Math.PI) / 180;
  const r2 = (hue2 * Math.PI) / 180;
  const x = Math.cos(r1) * (1 - weight) + Math.cos(r2) * weight;
  const y = Math.sin(r1) * (1 - weight) + Math.sin(r2) * weight;
  const result = (Math.atan2(y, x) * 180) / Math.PI;
  return result < 0 ? result + 360 : result;
}

// ─── Core extraction ──────────────────────────────────────────────────────────

/**
 * Loads an image onto a canvas and returns the dominant hue (0–360).
 * Returns null if image fails to load or has no colorful pixels (CORS etc).
 */
function getDominantHue(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(null); return; }

        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        // Bucket pixels by hue (30° buckets = 12 total)
        const buckets: Record<number, number> = {};
        let colorfulPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]     / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const a = data[i + 3] / 255;

          if (a < 0.5) continue;
          const [h, s, l] = rgbToHsl(r, g, b);
          console.log("pixel hsl:", h.toFixed(0), s.toFixed(2), l.toFixed(2));
          if (s < MIN_SAT || l < MIN_LIT || l > MAX_LIT) continue;

          const bucket = Math.floor(h / 30) * 30;
          buckets[bucket] = (buckets[bucket] ?? 0) + 1;

               colorfulPixels++;
        }
            console.log("colorful pixels found:", colorfulPixels, "from url:", url);
        const entries = Object.entries(buckets);
        if (entries.length === 0) { resolve(null); return; }

        const dominant = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
        resolve(Number(dominant[0]) + 15); // center of bucket

      } catch(e) {
    console.log("Canvas CORS error:", e, url);
        resolve(null); // CORS or security error
      }
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Takes one or more dominant hues, blends them together,
 * then blends with the app theme purple.
 * Forces the result into a dark saturated range safe for the app theme.
 */
function buildAccentColor(hues: number[]): string {
  if (hues.length === 0) return DEFAULT_COLOR;

  // Average all extracted hues using circular blending
  let blendedHue = hues[0];
  for (let i = 1; i < hues.length; i++) {
    blendedHue = blendHues(blendedHue, hues[i], 1 / (i + 1));
  }

  // Blend with theme purple hue
  const finalHue = blendHues(THEME_PURPLE_H, blendedHue, BLEND_WEIGHT);

  // Force into dark saturated range — keeps it native to app theme
  const finalSat = THEME_PURPLE_S + (0.15 * BLEND_WEIGHT);   // 0.6 → ~0.65
  const finalLit = THEME_PURPLE_L + (0.08 * BLEND_WEIGHT);   // 0.12 → ~0.15

  return hslToHex(finalHue, finalSat, finalLit);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAccentColor(
  coverImage: string | undefined,
  songCovers: (string | undefined)[],
): string {
  const [color, setColor] = useState<string>(DEFAULT_COLOR);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // ── Case 1: single playlist cover ──
      if (coverImage) {
        const hue = await getDominantHue(coverImage);
        if (!cancelled) {
          setColor(hue !== null ? buildAccentColor([hue]) : DEFAULT_COLOR);
        }
        return;
      }

      // ── Case 2: mosaic — sample all available song covers ──
      const validCovers = songCovers.filter((c): c is string => Boolean(c)).slice(0, 4);
      if (validCovers.length > 0) {
        const hues = await Promise.all(validCovers.map(getDominantHue));
        const validHues = hues.filter((h): h is number => h !== null);
        if (!cancelled) {
          setColor(validHues.length > 0 ? buildAccentColor(validHues) : DEFAULT_COLOR);
        }
        return;
      }

      // ── Case 3: nothing available ──
      if (!cancelled) setColor(DEFAULT_COLOR);
    }

    run();
    return () => { cancelled = true; };

  }, [coverImage, songCovers[0], songCovers[1], songCovers[2], songCovers[3]]); // eslint-disable-line react-hooks/exhaustive-deps

  return color;
}