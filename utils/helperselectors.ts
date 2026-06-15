import { Playlist } from "@/types/playlist";
import { Song } from "@/types/song";
import { Folder } from "@/types/folder";

export function getPlaylistSongs(
  playlistId: string,
  playlists: Playlist[],
  songs: Song[],
) {
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return [];

  return songs.filter((song) => playlist.songIds.includes(song.id));
}
export function getFolderPlaylists(
  folderId: string,
  folders: Folder[],
  playlists: Playlist[],
) {
  const folder = folders.find((f) => f.id === folderId);

  if (!folder) return [];

  return playlists.filter((playlist) =>
    folder.playlistIds.includes(playlist.id),
  );
}

export function getSongById(songId: string, songs: Song[]) {
  return songs.find((song) => song.id === songId);
}

export function getPlaylistById(playlistId: string, playlists: Playlist[]) {
  return playlists.find((playlist) => playlist.id === playlistId);
}
export function getFolderById(folderId: string, folders: Folder[]) {
  return folders.find((folder) => folder.id === folderId);
}
