"use client";

import SongCard from "../features/RightSidebar/Song/songCard";
import "../styles/backgrounds.css";
import "overlayscrollbars/overlayscrollbars.css";
import { useAppSelector } from "@/globalHooks";
import { selectCurrentSong } from "@/store/playerSlice";

const Rightsidebar = () => {
  const song = useAppSelector(selectCurrentSong);

  return (
    <div className="h-full w-full md:flex hidden min-w-0 glass rounded-md">
      {song ? (
        <SongCard />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/20 text-sm">
          No song playing
        </div>
      )}
    </div>
  );
};

export default Rightsidebar;