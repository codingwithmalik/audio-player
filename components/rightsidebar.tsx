"use client";
import React from "react";
import SongCard from "../features/RightSidebar/Song/songCard";
import { useDevice } from "@/contexts/devicecontext";
import "../styles/backgrounds.css"

const Rightsidebar = () => {
  const { isPC } = useDevice();
  const song = {
    title: "Blinding Lights",
    artists: ["The Weeknd"],
    coverImage:
      "/logo.png",
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
            ? "flex items-center justify-center w-full h-full overflow-hidden glass"
            : "hidden"
        }
      >
        <SongCard song={song} onSaveToggle={(s) => console.log(s)} /> 
      </div>
    </div>
  );
};

export default Rightsidebar;
