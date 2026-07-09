import Image from "next/image";
import { Song } from "@/types/song";
import { Music2, Pause, Play } from "lucide-react";
import { useState } from "react";
export default function PlaylistSongGridCard({
  song,
  isPlaying,
  onPlaySong,
  isCurrent,
}: {
  song: Song;
  isPlaying: boolean;
  onPlaySong: () => void;
  isCurrent: boolean;
}) {
  const [imgReady, setImgReady] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleLoad = () => setImgReady(true);
  const handleError = () => setImgFailed(true);
  return (
    <div
      onClick={() => {
        if (window.innerWidth < 640) onPlaySong();
      }}
      onDoubleClick={() => {
        if (window.innerWidth >= 640) onPlaySong();
      }}
      className={`flex flex-col gap-2 p-3 rounded-xl md:hover:bg-white/10
                 transition-colors duration-150 cursor-default group bg-white/5`}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden z-10">
        {/* Fallback icon */}
        <div className="relative w-full h-full rounded-md shrink-0 flex items-center justify-center">
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
        <div
          className="absolute inset-0 bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100
                    transition-opacity duration-150"
        >
          <button
            onClick={onPlaySong}
            aria-label="Play"
            className="absolute bottom-1 right-1
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150"
          >
            <div className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="text-black fill-black" />
              ) : (
                <Play className="text-black fill-black " />
              )}
            </div>
          </button>
        </div>
      </div>
      <div className="min-w-0">
        <p
          className={`text-sm font-medium truncate ${isCurrent ? "text-purple-600" : "text-white"}`}
        >
          {song.title}
        </p>
        <p className="text-xs text-white/50 truncate">
          {song.artists.join(", ")}
        </p>
      </div>
    </div>
  );
}
