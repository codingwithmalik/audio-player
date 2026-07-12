"use client";

import { useEffect } from "react";
import PanelSheet from "@/features/Common/PanelSheet";
import SongCard from "@/features/RightSidebar/Song/songCard";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { selectCurrentSong, closeNowPlaying } from "@/store/playerSlice";
import { openQueue, closeRightSidebarPanel } from "@/slices/rightSidebarSlice";
import { useIsMobile } from "@/hooks/useIsMobile";

interface NowPlayingViewProps {
  isOpen: boolean;
  onClosed?: () => void;
}

export default function NowPlayingView({
  isOpen,
  onClosed,
}: NowPlayingViewProps) {
  const dispatch = useAppDispatch();
  const song = useAppSelector(selectCurrentSong);
  const isBelowQueueBreakpoint = useIsMobile(768);

  // Prevent NowPlayingView from stacking on top of an already-open
  // right-sidebar panel (Queue/AddToPlaylist/AddToFolder) below 1024px.
  useEffect(() => {
    if (isOpen) {
      dispatch(closeRightSidebarPanel());
    }
  }, [isOpen, dispatch]);

  const handleClose = () => dispatch(closeNowPlaying());
  const handleOpenQueue = () => {
    handleClose();
    dispatch(openQueue());
  };

  if (!song) return null;

  return (
    <PanelSheet
      isOpen={isOpen}
      onClose={handleClose}
      onClosed={onClosed}
      mode="overlay"
    >
      <SongCard
        variant="full"
        onClose={handleClose}
        onOpenQueue={isBelowQueueBreakpoint ? undefined : handleOpenQueue}
      />
    </PanelSheet>
  );
}
