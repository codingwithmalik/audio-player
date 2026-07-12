"use client";

import PanelSheet from "@/features/Common/PanelSheet";
import SongCard from "@/features/RightSidebar/Song/songCard";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { selectCurrentSong, closeNowPlaying } from "@/store/playerSlice";

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

  const handleClose = () => dispatch(closeNowPlaying());

  if (!song) return null;

  return (
    <PanelSheet
      isOpen={isOpen}
      onClose={handleClose}
      onClosed={onClosed}
      mode="overlay"
    >
      <SongCard variant="full" onClose={handleClose} />
    </PanelSheet>
  );
}
