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

  songs: PlaylistSong[];

  folderId: string | null;

  ownerId: string;

  createdAt: string;

  updatedAt: string;

  /** Last time a song was played from this playlist (not just opened/viewed). */
  accessedAt?: string ;
  
  /** Set when the user deletes the playlist. Presence of this field means
   *  "in trash" — the playlist is hidden from normal library views but not
   *  yet permanently gone. Expiry is computed as deletedAt + 90 days,
   *  not stored, so changing the retention window doesn't need a migration. */
  deletedAt?: string;
}