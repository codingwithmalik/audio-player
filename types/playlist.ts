export interface PlaylistSong {
  songId: string;
  addedAt: string;
}
export interface Playlist {
  id: string;

  type: "playlist";

  title: string;

  description?: string;

  coverImage?: string;

  songs:PlaylistSong[];

  folderId: string | null;

  ownerId: string;

  createdAt: string;

  updatedAt: string;
}
