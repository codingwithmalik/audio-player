import { Song } from "@/types/song";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";

export const songs: Song[] = [
  {
    id: "song-1",
    title: "Love Lost",
    artists: ["Umair", "Talha Anjum"],
    coverImage: "https://picsum.photos/seed/blinding/600/600",
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
    coverImage: "https://picsum.photos/seed/darkside/600/600",
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
    coverImage: "https://picsum.photos/seed/darkside/600/600",
    audioUrl: "/audio/agency.mp3",
    duration: 210,
    uploadedBy: "user-1",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },

  {
    id: "s1",
    title: "DARKSIDE",
    artists: ["Neoni"],
    coverImage: "https://picsum.photos/seed/darkside/600/600",
    audioUrl: "",
    duration: 168,
    uploadedBy: "user-1",
    createdAt: "2025-09-24T00:00:00Z",
    updatedAt: "2025-09-24T00:00:00Z",
  },
  {
    id: "s2",
    title: "LUNA BALA - Slowed",
    artists: ["Yb Wasg'ood", "Ariis", "MC PR"],
    coverImage: "https://picsum.photos/seed/luna/600/600",
    audioUrl: "",
    duration: 124,
    uploadedBy: "user-1",
    createdAt: "2025-10-11T00:00:00Z",
    updatedAt: "2025-10-11T00:00:00Z",
  },
  {
    id: "s3",
    title: "GLORY",
    artists: ["Ogryzek"],
    coverImage: "https://picsum.photos/seed/glory/600/600",
    audioUrl: "",
    duration: 149,
    uploadedBy: "user-1",
    createdAt: "2025-10-11T00:00:00Z",
    updatedAt: "2025-10-11T00:00:00Z",
  },
  {
    id: "s4",
    title: "Bad Guy",
    artists: ["Billie Eilish"],
    coverImage: "https://picsum.photos/seed/badguy/600/600",
    audioUrl: "",
    duration: 194,
    uploadedBy: "user-2",
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "s5",
    title: "HIGHEST IN THE ROOM",
    artists: ["Travis Scott"],
    coverImage: "https://picsum.photos/seed/highest/600/600",
    audioUrl: "",
    duration: 176,
    uploadedBy: "user-2",
    createdAt: "2025-07-15T00:00:00Z",
    updatedAt: "2025-07-15T00:00:00Z",
  },
  {
    id: "s6",
    title: "Blinding Lights",
    artists: ["The Weeknd"],
    coverImage: "https://picsum.photos/seed/blinding/600/600",
    audioUrl: "",
    duration: 200,
    uploadedBy: "user-2",
    createdAt: "2025-06-30T00:00:00Z",
    updatedAt: "2025-06-30T00:00:00Z",
  },
];

export const playlists: Playlist[] = [
  {
    id: "playlist-1",
    type: "playlist",
    title: "Chill Vibes",
    description: "Late night music",
    // coverImage: "https://picsum.photos/seed/darkside/600/600",
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
      { songId: "s1", addedAt: "2025-09-24T00:00:00Z" },
      { songId: "s2", addedAt: "2025-10-11T00:00:00Z" },
      { songId: "s3", addedAt: "2025-10-11T00:00:00Z" },
      { songId: "s4", addedAt: "2025-08-01T00:00:00Z" },
      { songId: "s5", addedAt: "2025-07-15T00:00:00Z" },
      { songId: "s6", addedAt: "2025-06-30T00:00:00Z" },
    ],
    folderId: null,
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
    playlistIds: [],
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
