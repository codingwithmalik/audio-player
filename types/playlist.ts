export interface Playlist {
  id: string;

  type: "playlist";

  title: string;

  description?: string;

  coverImage?: string;

  songIds: string[];

  folderId: string | null;

  ownerId: string;

  createdAt: string;

  updatedAt: string;
}
