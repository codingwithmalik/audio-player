import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";

// export type LibraryType = "playlist" | "folder";

export type LibraryItem = Playlist | Folder;

export type SortType = "recents" | "recently-added" | "alphabetical";

export type FilterType = "playlists" | "folders";

export interface LibraryState {
  search: string;
  sort: SortType;
  filters: FilterType[];
}