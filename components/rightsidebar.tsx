"use client";
import SongCard from "../features/RightSidebar/Song/songCard";
import "../styles/backgrounds.css";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useAppSelector } from "@/globalHooks";
import { selectCurrentSong} from "@/store/playerSlice";

const Rightsidebar = () => {
  const song = useAppSelector(selectCurrentSong);
  return (
    <div
      className={
        "h-full w-full md:flex items-center justify-between min-w-0 glass hidden rounded-lg overflow-hidden"
      }
    >
      <OverlayScrollbarsComponent
        defer
        options={{
          scrollbars: {
            theme: "os-theme-light",
            autoHide: "leave",
            autoHideDelay: 0,
          },
        }}
        className="h-full w-full "
      >
        {song && (
          <div className="overflow-y-auto w-full scrollbar-none ">
            <SongCard />
          </div>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default Rightsidebar;
