import { connectDB } from "@/lib/db/connect";
import { songRepository } from "@/repositories/songRepository";
import Playlist from "@/schemas/Playlist";
import { NotFoundError, AuthorizationError } from "@/lib/errors";

export const songService = {
  async createSong(userId: string, data: any) {
    await connectDB();
    return songRepository.create({ ...data, uploadedBy: userId });
  },

  async getSong(id: string) {
    await connectDB();
    const song = await songRepository.findById(id);
    if (!song) throw new NotFoundError("Song not found");
    return song;
  },

  async getSongsByIds(ids: string[]) {
    await connectDB();
    const songs = await songRepository.findMany({ _id: { $in: ids } });
    const byId = new Map(songs.map((s) => [s.toJSON().id, s.toJSON()]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
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
    if (!song) throw new NotFoundError("Song not found");
    if (song.uploadedBy !== userId) throw new AuthorizationError();
    return songRepository.updateById(id, data);
  },

  async deleteSong(userId: string, id: string) {
    await connectDB();
    const song = await songRepository.findById(id);
    if (!song) throw new NotFoundError("Song not found");
    if (song.uploadedBy !== userId) throw new AuthorizationError();

    await Playlist.updateMany(
      { "songs.songId": id },
      { $pull: { songs: { songId: id } } },
    );

    return songRepository.deleteById(id);
  },
};
