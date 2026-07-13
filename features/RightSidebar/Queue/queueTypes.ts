export interface QueueState {
  currentIndex: number;
  songIds: string[];
  sourceType: "playlist" | "search" | "liked" | null;
  sourceId: string | null;
  manualQueueIds: string[]; // NEW — temporary "Add to Queue" list
}
