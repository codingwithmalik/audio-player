import { Song } from "@/types/song";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";

export const songs: Song[] = [
  {
    id: "song-1",
    title: "Love Lost",
    artists: ["Umair", "Talha Anjum"],
    coverImage: "https://picsum.photos/seed/blinding/600/600",
    audioUrl: "/audio/Kalimba.mp3",
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
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
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
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
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
    audioUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
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
    audioUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
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
    audioUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    duration: 200,
    uploadedBy: "user-2",
    createdAt: "2025-06-30T00:00:00Z",
    updatedAt: "2025-06-30T00:00:00Z",
  },
  {
    id: "proximity-dj-snake-bieber",
    title: "Let Me Love You",
    artists: ["DJ Snake", "Justin Bieber"],
    audioUrl: "/audio/letmeloveyou.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1523354177913-be035fcee55e?w=600&h=600&fit=crop&auto=format",

    duration: 198,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["pop", "dance"],
  },
  {
    id: "middle-of-the-night-elley-duhe",
    title: "Middle of the Night",
    artists: ["Elley Duhé"],
    audioUrl: "/audio/middleofnight.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1697984779325-ee1933b1a78a?w=600&h=600&fit=crop&auto=format",

    duration: 200,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["pop", "dark pop"],
  },
  {
    id: "him-and-i-geazy-halsey",
    title: "Him & I",
    artists: ["G-Eazy", "Halsey"],
    audioUrl: "/audio/himandI.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1519307212971-dd9561667ffb?w=600&h=600&fit=crop&auto=format",

    duration: 285,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["hip-hop", "romantic"],
  },
  {
    id: "heat-waves-glass-animals",
    title: "Heat Waves",
    artists: ["Glass Animals"],
    audioUrl: "/audio/heatwaves.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1708748513828-2227f6d39c04?w=600&h=600&fit=crop&auto=format",

    duration: 238,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["indie", "chill"],
  },
  {
    id: "darkside-neoni",
    title: "DARKSIDE",
    artists: ["Neoni"],
    audioUrl: "/audio/darkside.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1758551051834-61f10a361b73?w=600&h=600&fit=crop&auto=format",

    duration: 187,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["electronic", "dark pop"],
  },
  {
    id: "sweater-weather-the-neighbourhood",
    title: "Sweater Weather",
    artists: ["The Neighbourhood"],
    audioUrl: "/audio/sweatherweather.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1736158064402-5b68c2cbcc77?w=600&h=600&fit=crop&auto=format",

    duration: 240,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["indie rock", "romantic"],
  },
  {
    id: "starboy-the-weeknd",
    title: "Starboy",
    artists: ["The Weeknd", "Daft Punk"],
    audioUrl: "/audio/starboy.mp3",
    coverImage:
      "https://images.unsplash.com/photo-1747499967281-c0c5eec9933c?w=600&h=600&fit=crop&auto=format",
    duration: 230,
    uploadedBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "english",
    genres: ["r&b", "pop"],
  },
];

export const playlists: Playlist[] = [
  {
    id: "playlist-1",
    type: "playlist",
    title: "Chill Vibes",
    description: "Late night music",
    // coverImage: "https://picsum.photos/seed/darkside/600/600",
    coverImage: "https://picsum.photos/seed/glory/600/600",
    // coverImage: "https://picsum.photos/seed/highest/600/600",

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
  {
    id: "playlist-4",
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
    ownerId: "user-2",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
  },
  {
    id: "liked-user-1",
    type: "playlist",
    title: "Liked Songs",
    description: "",
    coverImage: "",
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
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  },
  {
    id: "playlist-mixed-hits",
    title: "Mixed Hits",
    type: "playlist",
    description: "A mix of pop, indie, and R&B favorites",
    coverImage:
      "https://images.unsplash.com/photo-1747499967281-c0c5eec9933c?w=600&h=600&fit=crop&auto=format",

    ownerId: "user-1",
    folderId: null,
    songs: [
      {
        songId: "proximity-dj-snake-bieber",
        addedAt: new Date().toISOString(),
      },
      {
        songId: "middle-of-the-night-elley-duhe",
        addedAt: new Date().toISOString(),
      },
      { songId: "him-and-i-geazy-halsey", addedAt: new Date().toISOString() },
      { songId: "heat-waves-glass-animals", addedAt: new Date().toISOString() },
      { songId: "darkside-neoni", addedAt: new Date().toISOString() },
      {
        songId: "sweater-weather-the-neighbourhood",
        addedAt: new Date().toISOString(),
      },
      { songId: "starboy-the-weeknd", addedAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    id: "folder-2",
    type: "folder",
    title: "Pakistani Music",
    playlistIds: ["playlist-1"],
    ownerId: "user-2",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-010",
  },
];
