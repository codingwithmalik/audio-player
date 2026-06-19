import Image from "next/image";
import { Song } from "@/types/song";
import { Music2} from "lucide-react"
import { useState } from "react";
export default function PlaylistSongGridCard({

  song,
  isPlaying,
  onPlaySong,
}: {
  song: Song;
  isPlaying: boolean;
  onPlaySong: () => void;
}) {
    const [imgReady, setImgReady] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
  
    const handleLoad = () => setImgReady(true);
    const handleError = () => setImgFailed(true);
  return (
    <div
      onDoubleClick={onPlaySong}
      className={`flex flex-col gap-2 p-3 rounded-xl hover:bg-white/10
                 transition-colors duration-150 cursor-default group ${isPlaying ? "bg-[#141424]":"bg-white/5"}`}
                 >
      <div className="relative aspect-square rounded-lg overflow-hidden z-10">
                {/* Fallback icon */}
        <div className="relative w-11 h-11 rounded-md shrink-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 flex items-center justify-center bg-white/10 transition-opacity duration-200 rounded-md ${
              imgReady || (song.coverImage && !imgFailed)
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <Music2 className="w-7 h-7 text-white/60" />
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
        {/* Play overlay */}
        <button
          onClick={onPlaySong}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center
                     bg-black/40 opacity-0 group-hover:opacity-100
                     transition-opacity duration-150"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-medium truncate ${isPlaying ? "text-purple-600" : "text-white"}`}>
          {song.title}
        </p>
        <p className="text-xs text-white/50 truncate">
          {song.artists.join(", ")}
        </p>
      </div>
    </div>
  );
}