"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Music2 } from "lucide-react";

interface SongCoverProps {
  src?: string | null;
  alt: string;
  /** Size in px — used for both width and height (square cover art). Default 44. */
  size?: number;
  rounded?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function SongCover({
  src,
  alt,
  size = 44,
  rounded = "rounded-md",
  className = "",
  sizes,
  priority = false,
}: SongCoverProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when the source changes (e.g. row reused for a
  // different song), so a failed image doesn't get stuck forever.
  useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${rounded} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Placeholder icon — always rendered underneath, so it's visible
          instantly and shows through if there's no src, or the image
          fails, or while it's still loading in. */}
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-purple-900/60 to-indigo-900/60">
        <Music2
          className="text-white/30"
          style={{ width: size * 0.4, height: size * 0.4 }}
        />
      </div>

      {src && !imgError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? `${size}px`}
          priority={priority}
          className="object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
