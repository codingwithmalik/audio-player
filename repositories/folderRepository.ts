import Folder from "@/schemas/Folder";

export const folderRepository = {
  create: (data: any) => Folder.create(data),
  findById: (id: string) => Folder.findById(id),
  findByOwner: (ownerId: string) => Folder.find({ ownerId }),
  updateById: (id: string, data: any) =>
    Folder.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => Folder.findByIdAndDelete(id),
};
