"use client";
import SongCard from "../features/RightSidebar/Song/songCard";
import "../styles/backgrounds.css";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const Rightsidebar = () => {
  const song = {
    title: "Blinding Lights",
    artists: ["The Weeknd", "Dua Lipa"],
    coverImage: "/logo.png",
    dateAdded: "2025-05-14",
    duration: 200,
    songUrl: "https://example.com/blinding-lights",
    isSaved: true,
  };

  return (
    <div
      className={
        "h-full w-full md:flex items-center justify-between min-w-0 glass hidden rounded-lg overflow-hidden"
      }
    >
      <OverlayScrollbarsComponent
        defer
        options={{ scrollbars: { theme: "os-theme-light", autoHide: "leave" , autoHideDelay:0} }}
        className="h-full w-full "
      >
        <div className="overflow-y-auto w-full scrollbar-none ">
          <SongCard song={song} onSaveToggle={(s) => console.log(s)} />
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default Rightsidebar;
