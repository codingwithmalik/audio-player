export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentSongId: string | null;

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
