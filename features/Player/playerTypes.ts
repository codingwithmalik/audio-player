export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentSongId: string | null;

  isPlaying: boolean;

  currentTime: number;

  volume: number;

  prevVolume: number;

  isMuted: boolean;

  isShuffle: boolean;

  repeatMode: RepeatMode;

  isDraggingProgress: boolean;

  isDraggingVolume: boolean;
}
