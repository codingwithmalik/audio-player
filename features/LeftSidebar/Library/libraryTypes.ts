export type LibraryType = "playlist" | "folder";

export interface Playlist {
  id: string;
  type: "playlist";
  title: string;
  coverImage: string;
  songsCount: number;
}

export interface Folder {
  id: string;
  type: "folder";
  title: string;
  icon: string;
  playlistsCount: number;
}

export type LibraryItem = Playlist | Folder;

export type SortType =
  | "folders"
  | "playlists"
  | "mixed";