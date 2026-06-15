export interface QueueState {
  currentIndex: number;

  songIds: string[];

  sourceType: "playlist" | "folder" | "search" | "liked" | null;

  sourceId: string | null;
}
