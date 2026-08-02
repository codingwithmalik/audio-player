import { connectDB } from "@/lib/db/connect";
import { Types } from "mongoose";
import Playlist from "@/schemas/Playlist";
import { playlistRepository } from "@/repositories/playlistRepository";
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
} from "@/lib/errors";

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
    if (!playlist || playlist.deletedAt)
      throw new NotFoundError("Playlist not found");
    return playlist;
  },

  async listUserPlaylists(userId: string, folderId: string | null = null) {
    await connectDB();
    return playlistRepository.findByOwner(userId, folderId);
  },

  async updatePlaylist(userId: string, id: string, data: any) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();
    if (id.startsWith("liked-"))
      throw new ValidationError("Cannot modify the Liked Songs playlist");

    return playlistRepository.updateById(id, data);
  },

  async softDeletePlaylist(userId: string, id: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();
    if (id.startsWith("liked-"))
      throw new ValidationError("Cannot delete the Liked Songs playlist");

    return playlistRepository.updateById(id, { deletedAt: new Date() });
  },

  async permanentlyDelete(userId: string, id: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();
    await playlistRepository.deleteById(id);
  },

  async restorePlaylist(userId: string, id: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(id);
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();

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
        await Playlist.findByIdAndDelete(p._id);
      } else {
        stillValid.push(p);
      }
    }
    return stillValid;
  },

  async addSongs(userId: string, playlistId: string, songIds: string[]) {
    await connectDB();
    const playlist = await playlistRepository.findById(playlistId);
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();

    const existingIds = new Set(playlist.songs.map((s: any) => s.songId));
    const now = new Date();

    for (const songId of songIds) {
      if (existingIds.has(songId)) continue;
      playlist.songs.push({ songId, addedAt: now });
      existingIds.add(songId);
    }

    playlist.accessedAt = new Date();
    await playlist.save();
    return playlist;
  },

  async removeSong(userId: string, playlistId: string, songId: string) {
    await connectDB();
    const playlist = await playlistRepository.findById(playlistId);
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();

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
    if (!playlist) throw new NotFoundError("Playlist not found");
    if (playlist.ownerId !== userId) throw new AuthorizationError();
    if (playlistId.startsWith("liked-"))
      throw new ValidationError("Cannot move Liked Songs into a folder");

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
