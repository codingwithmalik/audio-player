"use client";

import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectRightSidebarPanel,
  closeRightSidebarPanel,
} from "@/slices/rightSidebarSlice";
import PanelSheet from "@/features/Common/PanelSheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import QueuePanel from "@/features/RightSidebar/Queue/queuePanel";
import AddToPlaylistPanel from "@/features/RightSidebar/PlaylistPanel/addToPlaylistPanel";
import AddToFolderPanel from "@/features/RightSidebar/FolderPanel/addToFolderPanel";

export default function RightSidebarPanelOverlay() {
  const dispatch = useAppDispatch();
  const panel = useAppSelector(selectRightSidebarPanel);
  const isBelowSidebarBreakpoint = useIsMobile(1024);

  const isOpen = isBelowSidebarBreakpoint && panel.tab !== "default";

  const handleClose = () => dispatch(closeRightSidebarPanel());

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40  transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 h-[92vh] ">
        <PanelSheet isOpen={isOpen} onClose={handleClose} mode="overlay">
          {panel.tab === "queue" && <QueuePanel />}
          {panel.tab === "addToPlaylist" && (
            <AddToPlaylistPanel playlistId={panel.playlistId} />
          )}
          {panel.tab === "addToFolder" && (
            <AddToFolderPanel folderId={panel.folderId} />
          )}
        </PanelSheet>
      </div>
    </div>
  );
}
