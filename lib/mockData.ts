import { Song } from "@/types/song";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";

export const songs: Song[] = [
  {
    id: "song-1",
    title: "Love Lost",
    artists: ["Umair", "Talha Anjum"],
    coverImage: "/covers/love-lost.jpg",
    audioUrl: "/audio/love-lost.mp3",
    duration: 240,
    uploadedBy: "user-1",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },

  {
    id: "song-2",
    title: "Downers At Dusk",
    artists: ["Talha Anjum"],
    coverImage: "/covers/downers.jpg",
    audioUrl: "/audio/downers.mp3",
    duration: 280,
    uploadedBy: "user-1",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },

  {
    id: "song-3",
    title: "Agency",
    artists: ["Talha Anjum"],
    coverImage: "/covers/agency.jpg",
    audioUrl: "/audio/agency.mp3",
    duration: 210,
    uploadedBy: "user-1",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
];

export const playlists: Playlist[] = [
  {
    id: "playlist-1",
    type: "playlist",
    title: "Chill Vibes",
    description: "Late night music",
    coverImage: "https://picsum.photos/seed/darkside/600/600",
    songs: [
      {
        songId: "song-1",
        addedAt: "2025-01-03",
      },
      {
        songId: "song-2",
        addedAt: "2025-01-03",
      },
      {
        songId: "song-3",
        addedAt: "2025-01-03",
      },
    ],
    folderId: "folder-1",
    ownerId: "user-1",
    createdAt: "2025-01-03",
    updatedAt: "2025-01-03",
  },

  {
    id: "playlist-2",
    type: "playlist",
    title: "Favorites",
    description: "Best tracks",
    coverImage: "/covers/favorites.jpg",
    songs: [
      {
        songId: "song-1",
        addedAt: "2025-01-05",
      },
    ],
    folderId: null,
    ownerId: "user-1",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-05",
  },

  {
    id: "playlist-3",
    type: "playlist",
    title: "Dark",
    description: "Best tracks",
    coverImage: "https://picsum.photos/seed/darkside/600/600",
    songs: [
      {
        songId: "song-1",
        addedAt: "2025-01-10",
      },
    ],
    folderId: null,
    ownerId: "user-1",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
  },
];

export const folders: Folder[] = [
  {
    id: "folder-1",
    type: "folder",
    title: "Pakistani Music",
    playlistIds: ["playlist-1"],
    ownerId: "user-1",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-010",
  },
  {
    id: "folder-1",
    type: "folder",
    title: "Pakistani Music",
    playlistIds: ["playlist-1"],
    ownerId: "user-2",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-010",
  },
];
