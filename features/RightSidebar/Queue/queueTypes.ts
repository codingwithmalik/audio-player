export interface QueueState {
  currentIndex: number;
  songIds: string[];
  originalSongIds: string[];
  sourceType: "playlist" | "search" | "liked" | "home" | null;
  sourceId: string | null;
  manualQueueIds: string[]; // NEW — temporary "Add to Queue" list
}
