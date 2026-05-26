"use client";
import React from "react";
import SongCard from "../features/RightSidebar/Song/songCard";
import { useDevice } from "@/contexts/devicecontext";

const Rightsidebar = () => {
  const { isPC, isMobile } = useDevice();

  const song = {
    title: "Blinding Lights",
    artists: ["The Weeknd"],
    coverImage:
      "https://i.scdn.co/image/ab67616d0000b2730c8a1e5f1b2c3d4e5f6g7h8",
    dateAdded: "2025-05-14",
    duration: 200,
    songUrl: "https://example.com/blinding-lights",
    isSaved: true,
  };

  return (
    <div>
      <div
        className={
          isPC
            ? "flex items-center justify-center top-[10vh] right-0 m-1 p-2 absolute min-h-[75vh] min-w-[20vw] bg-white/5  border-b border-white/10  backdrop-blur-2xl rounded-2xl "
            : "hidden"
        }
      >
        <SongCard song={song} onSaveToggle={(s) => console.log(s)} />
      </div>
    </div>
  );
};

export default Rightsidebar;
