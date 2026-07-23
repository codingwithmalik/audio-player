import { connectDB } from "@/lib/db/connect";
import { Types } from "mongoose";
import Playlist from "@/schemas/Playlist";
import { playlistRepository } from "@/repositories/playlistRepository";

const TRASH_RETENTION_DAYS = 90;

function isExpired(deletedAt: Date) {
  const expiry = new Date(deletedAt);
  expiry.setDate(expiry.getDate() + TRASH_RETENTION_DAYS);
  return new Date() > expiry;
}

export const playlistService = {
  async ensureLikedPlaylist(userId: string) {
    await connectDB();
    const likedId = `liked-${userId}`;
    const existing = await Playlist.findById(likedId);
    if (existing) return existing;

    return Playlist.create({
      _id: likedId,
      title: "Liked Songs",
      description: "",
      songs: [],
      folderId: null,
      ownerId: userId,
    });
  },

  async createPlaylist(
    userId: string,
    data: { title: string; description?: string; coverImage?: string },
  ) {
    await connectDB();
    if (!data.title?.trim()) throw new Error("Title is required");

    return playlistRepository.create({
      _id: new Types.ObjectId().toString(),
      title: data.title,
      description: data.description || "",
      coverImage: data.coverImage,
      songs: [],
      folderId: null,
      ownerId: userId,
    });
  },

  async getPlaylist(id: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist || playlist.deletedAt) throw new Error("Playlist not found");
    return playlist;
  },

  async listUserPlaylists(userId: string, folderId: string | null = null) {
    await connectDB();
    return playlistRepository.findByOwner(userId, folderId);
  },

  async updatePlaylist(userId: string, id: string, data: any) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new Error("Playlist not found");
    if (playlist.ownerId !== userId) throw new Error("Not authorized");
    if (id.startsWith("liked-"))
      throw new Error("Cannot modify the Liked Songs playlist");

    return playlistRepository.updateById(id, data);
  },

  async softDeletePlaylist(userId: string, id: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new Error("Playlist not found");
    if (playlist.ownerId !== userId) throw new Error("Not authorized");
    if (id.startsWith("liked-"))
      throw new Error("Cannot delete the Liked Songs playlist");

    return playlistRepository.updateById(id, { deletedAt: new Date() });
  },

  async restorePlaylist(userId: string, id: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new Error("Playlist not found");
    if (playlist.ownerId !== userId) throw new Error("Not authorized");

    return Playlist.findByIdAndUpdate(
      id,
      { $unset: { deletedAt: "" } },
      { new: true },
    );
  },

  async listTrash(userId: string) {
    await connectDB();
    const trashed = await playlistRepository.findTrash(userId);

    const stillValid = [];
    for (const p of trashed) {
      if (isExpired(p.deletedAt)) {
        await Playlist.findByIdAndDelete(p._id); // lazy cleanup past retention window
      } else {
        stillValid.push(p);
      }
    }
    return stillValid;
  },

  async addSong(userId: string, playlistId: string, songId: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");
    if (playlist.ownerId !== userId) throw new Error("Not authorized");

    const alreadyIn = playlist.songs.some((s: any) => s.songId === songId);
    if (alreadyIn) return playlist;

    playlist.songs.push({ songId, addedAt: new Date() });
    playlist.accessedAt = new Date();
    await playlist.save();
    return playlist;
  },

  async removeSong(userId: string, playlistId: string, songId: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");
    if (playlist.ownerId !== userId) throw new Error("Not authorized");

    playlist.songs = playlist.songs.filter((s: any) => s.songId !== songId);
    await playlist.save();
    return playlist;
  },

  async moveToFolder(
    userId: string,
    playlistId: string,
    folderId: string | null,
  ) {
    await connectDB();
    const playlist = await playlistRepository.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");
    if (playlist.ownerId !== userId) throw new Error("Not authorized");
    if (playlistId.startsWith("liked-"))
      throw new Error("Cannot move Liked Songs into a folder");

    return playlistRepository.updateById(playlistId, { folderId });
  },

  async toggleLikedSong(userId: string, songId: string) {
    await connectDB();
    const liked = await this.ensureLikedPlaylist(userId);
    const alreadyLiked = liked.songs.some((s: any) => s.songId === songId);

    if (alreadyLiked) {
      liked.songs = liked.songs.filter((s: any) => s.songId !== songId);
      await liked.save();
      return { liked: false, playlist: liked };
    }

    liked.songs.push({ songId, addedAt: new Date() });
    await liked.save();
    return { liked: true, playlist: liked };
  },
};
