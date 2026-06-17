/**
 * extractAccentColor
 * ------------------
 * Draws an image onto a tiny offscreen canvas, reads the pixel data,
 * filters out boring colors (near-black, near-white, near-grey),
 * and returns the most dominant saturated color as a hex string.
 *
 * Falls back to DEFAULT_COLOR if:
 *   - No URL is provided
 *   - The image fails to load
 *   - CORS blocks canvas pixel access (image server missing the right headers)
 *   - No sufficiently colorful pixels are found
 *
 * CORS requirement:
 *   The image server must respond with:
 *     Access-Control-Allow-Origin: *
 *   Supabase Storage, Cloudinary, and S3 public buckets all support this.
 *   Configure it on your storage bucket before deploying.
 *
 * Usage:
 *   const color = await extractAccentColor(playlist.coverImage ?? songCovers[0])
 */

const DEFAULT_COLOR = "#8B1A1A";

// Canvas size — smaller = faster. 50×50 is more than enough for color sampling.
const SAMPLE_SIZE = 50;

// How many hue buckets to group pixels into (360 / 30 = 12 buckets)
const HUE_BUCKET_SIZE = 30;

// Thresholds for filtering out boring pixels
const MIN_SATURATION = 0.25;  // below this → too grey
const MIN_LIGHTNESS  = 0.15;  // below this → too dark
const MAX_LIGHTNESS  = 0.85;  // above this → too light

export async function extractAccentColor(
  imageUrl: string | undefined
): Promise<string> {
  if (!imageUrl) return DEFAULT_COLOR;

  return new Promise((resolve) => {
    const img = new Image();

    // Required for canvas pixel access on cross-origin images
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;

        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(DEFAULT_COLOR); return; }

        // Draw the image scaled down to our sample size
        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        // data is a flat Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]

        // Hue bucket → pixel count
        const buckets: Record<number, number> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]     / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const a = data[i + 3] / 255;

          // Skip transparent pixels
          if (a < 0.5) continue;

          const [h, s, l] = rgbToHsl(r, g, b);

          // Skip boring pixels
          if (s < MIN_SATURATION) continue;
          if (l < MIN_LIGHTNESS)  continue;
          if (l > MAX_LIGHTNESS)  continue;

          // Group into hue bucket
          const bucket = Math.floor(h / HUE_BUCKET_SIZE) * HUE_BUCKET_SIZE;
          buckets[bucket] = (buckets[bucket] ?? 0) + 1;
        }

        const entries = Object.entries(buckets);
        if (entries.length === 0) { resolve(DEFAULT_COLOR); return; }

        // Find the most populated hue bucket
        const dominantHue = entries.reduce((best, curr) =>
          curr[1] > best[1] ? curr : best
        )[0];

        // Convert the dominant hue back to a rich, saturated hex
        // We fix saturation at 60% and lightness at 35% for a good gradient base
        resolve(hslToHex(Number(dominantHue), 0.6, 0.35));

      } catch {
        // Canvas security error (CORS) or any other runtime error
        resolve(DEFAULT_COLOR);
      }
    };

    img.onerror = () => resolve(DEFAULT_COLOR);

    img.src = imageUrl;
  });
}

// ─── Color math helpers ───────────────────────────────────────────────────────

/**
 * RGB (0–1 each) → [hue (0–360), saturation (0–1), lightness (0–1)]
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if      (max === r) h = ((g - b) / delta + 6) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else                h = (r - g) / delta + 4;

    h = h * 60; // convert to degrees
  }

  return [h, s, l];
}

/**
 * HSL → hex string "#RRGGBB"
 * h: 0–360, s: 0–1, l: 0–1
 */
function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);

  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * value).toString(16).padStart(2, "0");
  };

  return `#${channel(0)}${channel(8)}${channel(4)}`;
}