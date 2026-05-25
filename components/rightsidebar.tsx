"use client";
import React from "react";
import SongCard from "../features/RightSidebar/Song/songCard";

const Rightsidebar = () => {
  const song = {
    title: "Blinding Lights",
    artists: ["The Weeknd"],
    coverImage:
      "https://i.scdn.co/image/ab67616d0000b2730c8a1e5f1b2c3d4e5f6g7h8",
    dateAdded: "2025-05-14",
    duration: 200,
    songUrl: "https://example.com/blinding-lights",
    isSaved: false,
  };

  return (
    <div className="top-[10vh] right-1 absolute w-[20vw] bg-amber-300  border-b border-white/10 bg-white/5 backdrop-blur-2xl md:rounded-b-2xl">
      <SongCard song={song} onSaveToggle={(s) => console.log(s)} />
    </div>
  );
};

export default Rightsidebar;
