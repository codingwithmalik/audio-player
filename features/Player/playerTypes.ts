export type RepeatMode = "off" | "all" | "one";

export type sourceType = "playlist" | "search" | "queue~" | null;

export interface PlayerState {
  currentSongId: string | null;

  sourceType: sourceType;

  sourceId: string | null;

  isPlaying: boolean;

  currentTime: number;

  isShuffle: boolean;

  repeatMode: RepeatMode;

  volume: number;

  prevVolume: number;

  isMuted: boolean;

  isDraggingProgress: boolean;

  isDraggingVolume: boolean;
}
