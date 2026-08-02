import { connectDB } from "@/lib/db/connect";
import Playlist from "@/schemas/Playlist";
import { folderRepository } from "@/repositories/folderRepository";
import { NotFoundError, AuthorizationError } from "@/lib/errors";

export const folderService = {
  async createFolder(userId: string, title: string) {
    await connectDB();
    return folderRepository.create({ title, ownerId: userId });
  },

  async getFolder(userId: string, id: string) {
    await connectDB();
    const folder = await folderRepository.findById(id);
    if (!folder) throw new NotFoundError("Folder not found");
    if (folder.ownerId !== userId) throw new AuthorizationError();

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
    if (!folder) throw new NotFoundError("Folder not found");
    if (folder.ownerId !== userId) throw new AuthorizationError();

    return folderRepository.updateById(id, { title });
  },

  async deleteFolder(userId: string, id: string) {
    await connectDB();
    const folder = await folderRepository.findById(id);
    if (!folder) throw new NotFoundError("Folder not found");
    if (folder.ownerId !== userId) throw new AuthorizationError();

    await Playlist.updateMany(
      { ownerId: userId, folderId: id },
      { $set: { folderId: null } },
    );

    return folderRepository.deleteById(id);
  },
};
