"use client";

import SongCard from "../features/RightSidebar/Song/songCard";
import QueuePanel from "@/features/RightSidebar/Queue/queuePanel";
import AddToPlaylistPanel from "@/features/RightSidebar/PlaylistPanel/addToPlaylistPanel";
import AddToFolderPanel from "@/features/RightSidebar/FolderPanel/addToFolderPanel";
import "../styles/backgrounds.css";
import "overlayscrollbars/overlayscrollbars.css";
import { useAppSelector } from "@/globalHooks";
import { selectRightSidebarPanel } from "@/slices/rightSidebarSlice";

const Rightsidebar = () => {
  const panel = useAppSelector(selectRightSidebarPanel);

  return (
    <div className="h-full w-full md:flex hidden min-w-0 glass rounded-md overflow-hidden">
      {panel.tab === "default" && <SongCard />}
      {panel.tab === "queue" && <QueuePanel />}
      {panel.tab === "addToPlaylist" && (
        <AddToPlaylistPanel playlistId={panel.playlistId} />
      )}
      {panel.tab === "addToFolder" && (
        <AddToFolderPanel folderId={panel.folderId} />
      )}
    </div>
  );
};

export default Rightsidebar;