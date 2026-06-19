import { useState } from "react";
import Image from "next/image";
import { Music } from "lucide-react";
import { Song } from "@/types/song";

export default function SongCover({ song }: { song: Song }) {
  const [imgReady, setImgReady] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleLoad = () => setImgReady(true);
  const handleError = () => setImgFailed(true);

  return (
    <div className="relative w-17 h-17 shrink-0 flex items-center justify-center">
      {/* Fallback icon */}
      <div
        className={`absolute object-cover inset-0 flex items-center justify-center bg-white/10 transition-opacity duration-200 ${
          imgReady || (song.coverImage && !imgFailed)
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <Music className="w-17 h-17 text-white/60" />
      </div>

      {/* Image layer */}
      {song.coverImage && !imgFailed && (
        <Image
          src={song.coverImage}
          alt={song.title}
          fill
          className={`object-cover rounded-md transition-opacity duration-200 ${
            imgReady ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
