export type HomeSectionSource = "playlists" | "history" | "madeForYou" | "newReleases";

export interface HomeSection {
  id: string;
  title: string;
  source: HomeSectionSource;
  itemType: "playlist" | "song";
  itemIds: string[];
}