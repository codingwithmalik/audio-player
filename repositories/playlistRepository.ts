import Playlist from "@/schemas/Playlist";

export const playlistRepository = {
  create: (data: any) => Playlist.create(data),
  findById: (id: string) => Playlist.findById(id),
  findByOwner: (ownerId: string, folderId: string | null = null) =>
    Playlist.find({ ownerId, folderId, deletedAt: { $exists: false } }),
  findTrash: (ownerId: string) => Playlist.find({ ownerId, deletedAt: { $exists: true } }),
  updateById: (id: string, data: any) => Playlist.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => Playlist.findByIdAndDelete(id),
};