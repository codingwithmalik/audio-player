import { connectDB } from "@/lib/db/connect";
import Playlist from "@/schemas/Playlist";
import { folderRepository } from "@/repositories/folderRepository";

export const folderService = {
  async createFolder(userId: string, title: string) {
    await connectDB();
    if (!title?.trim()) throw new Error("Title is required");
    return folderRepository.create({ title, ownerId: userId });
  },

  async getFolder(userId: string, id: string) {
    await connectDB();
    const folder = await folderRepository.findById(id);
    if (!folder) throw new Error("Folder not found");
    if (folder.ownerId !== userId) throw new Error("Not authorized");

    const playlists = await Playlist.find({
      ownerId: userId,
      folderId: id,
      deletedAt: { $exists: false },
    });
    return { ...folder.toObject(), playlists };
  },

  async listFolders(userId: string) {
    await connectDB();
    return folderRepository.findByOwner(userId);
  },

  async renameFolder(userId: string, id: string, title: string) {
    await connectDB();
    const folder = await folderRepository.findById(id);
    if (!folder) throw new Error("Folder not found");
    if (folder.ownerId !== userId) throw new Error("Not authorized");
    if (!title?.trim()) throw new Error("Title is required");

    return folderRepository.updateById(id, { title });
  },

  async deleteFolder(userId: string, id: string) {
    await connectDB();
    const folder = await folderRepository.findById(id);
    if (!folder) throw new Error("Folder not found");
    if (folder.ownerId !== userId) throw new Error("Not authorized");

    await Playlist.updateMany(
      { ownerId: userId, folderId: id },
      { $set: { folderId: null } },
    );

    return folderRepository.deleteById(id);
  },
};
