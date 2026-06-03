"use client";
import SongCard from "../features/RightSidebar/Song/songCard";
import "../styles/backgrounds.css";

const Rightsidebar = () => {
  const song = {
    title: "Blinding Lights",
    artists: ["The Weeknd","Dua Lipa"],
    coverImage: "/logo.png",
    dateAdded: "2025-05-14",
    duration: 200,
    songUrl: "https://example.com/blinding-lights",
    isSaved: true,
  };

  return (
      <div
        className={
          "min-h-full md:flex items-center justify-between min-w-0 overflow-y-auto glass hidden"
        }
      >
        <SongCard song={song} onSaveToggle={(s) => console.log(s)} />
      </div>
  );
};

export default Rightsidebar;
