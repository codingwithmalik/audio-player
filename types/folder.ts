export interface Folder {
  id: string;

  type: "folder";

  title: string;

  playlistIds: string[];

  ownerId: string;

  createdAt: string;

  updatedAt: string;
}
