/**
 * mockData.ts
 * -----------
 * Temporary mock data for development.
 * When backend is ready:
 *   1. Delete this file
 *   2. Replace the useEffect in playlistCard.tsx with a real API thunk
 *   3. Remove upsertPlaylists and upsertSongs dispatch calls from the page
 */

import { Playlist } from "@/types/playlist";
import { Song } from "@/types/song";

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "gym",
    type: "playlist",
    title: "GYM",
    description: undefined,
    coverImage: "https://picsum.photos/seed/darkside/600/600",
    songs: [
      { songId: "s1", addedAt: "2025-09-24T00:00:00Z" },
      { songId: "s2", addedAt: "2025-10-11T00:00:00Z" },
      { songId: "s3", addedAt: "2025-10-11T00:00:00Z" },
      { songId: "s4", addedAt: "2025-08-01T00:00:00Z" },
      { songId: "s5", addedAt: "2025-07-15T00:00:00Z" },
      { songId: "s6", addedAt: "2025-06-30T00:00:00Z" },
    ],
    folderId: null,
    ownerId: "user-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-10-11T00:00:00Z",
  },
  {
  id: "sex",
  type: "playlist",
  title: "SEX",
  description: "Late night vibes",
  coverImage: "https://picsum.photos/seed/sexplaylist/600/600",
  songs: [
    { songId: "s7", addedAt: "2025-10-12T00:00:00Z" },
    { songId: "s8", addedAt: "2025-10-12T00:00:00Z" },
    { songId: "s9", addedAt: "2025-10-12T00:00:00Z" },
    { songId: "s10", addedAt: "2025-10-12T00:00:00Z" },
  ],
  folderId: null,
  ownerId: "user-1",
  createdAt: "2025-10-12T00:00:00Z",
  updatedAt: "2025-10-12T00:00:00Z",
}
];

export const MOCK_SONGS: Song[] = [
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
  {
  id: "s7",
  title: "Earned It",
  artists: ["The Weeknd"],
  coverImage: "https://picsum.photos/seed/earnedit/600/600",
  audioUrl: "",
  duration: 277,
  uploadedBy: "user-1",
  createdAt: "2025-10-12T00:00:00Z",
  updatedAt: "2025-10-12T00:00:00Z",
},
{
  id: "s8",
  title: "Often",
  artists: ["The Weeknd"],
  coverImage: "https://picsum.photos/seed/often/600/600",
  audioUrl: "",
  duration: 249,
  uploadedBy: "user-1",
  createdAt: "2025-10-12T00:00:00Z",
  updatedAt: "2025-10-12T00:00:00Z",
},
{
  id: "s9",
  title: "Call Out My Name",
  artists: ["The Weeknd"],
  coverImage: "https://picsum.photos/seed/calloutmyname/600/600",
  audioUrl: "",
  duration: 228,
  uploadedBy: "user-1",
  createdAt: "2025-10-12T00:00:00Z",
  updatedAt: "2025-10-12T00:00:00Z",
},
{
  id: "s10",
  title: "Love Me Harder",
  artists: ["Ariana Grande", "The Weeknd"],
  coverImage: "https://picsum.photos/seed/lovemeharder/600/600",
  audioUrl: "",
  duration: 236,
  uploadedBy: "user-1",
  createdAt: "2025-10-12T00:00:00Z",
  updatedAt: "2025-10-12T00:00:00Z",
}
];
