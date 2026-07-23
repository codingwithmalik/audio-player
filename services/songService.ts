import { connectDB } from "@/lib/db/connect";
import { songRepository } from "@/repositories/songRepository";
import Playlist from "@/schemas/Playlist";

export const songService = {
  async createSong(userId: string, data: any) {
    await connectDB();
    if (
      !data.title ||
      !data.artists?.length ||
      !data.audioUrl ||
      !data.duration
    ) {
      throw new Error("Missing required song fields");
    }
    return songRepository.create({ ...data, uploadedBy: userId });
  },

  async getSong(id: string) {
    await connectDB();
    const song = await songRepository.findById(id);
    if (!song) throw new Error("Song not found");
    return song;
  },

  async listSongs(
    filter: any = {},
    pagination?: { skip: number; limit: number },
  ) {
    await connectDB();
    return songRepository.findMany(filter, pagination);
  },

  async updateSong(userId: string, id: string, data: any) {
    await connectDB();
    const song = await songRepository.findById(id);
    if (!song) throw new Error("Song not found");
    if (song.uploadedBy !== userId) throw new Error("Not authorized");
    return songRepository.updateById(id, data);
  },

  async deleteSong(userId: string, id: string) {
    await connectDB();
    const song = await songRepository.findById(id);
    if (!song) throw new Error("Song not found");
    if (song.uploadedBy !== userId) throw new Error("Not authorized");

    // Prevent dangling references in playlists that included this song
    await Playlist.updateMany(
      { "songs.songId": id },
      { $pull: { songs: { songId: id } } },
    );

    return songRepository.deleteById(id);
  },
};
