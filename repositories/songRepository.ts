import Song from "@/schemas/Song";

export const songRepository = {
  create: (data: any) => Song.create(data),
  findById: (id: string) => Song.findById(id),
  findMany: (filter: any, { skip = 0, limit = 20 } = {}) =>
    Song.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
  updateById: (id: string, data: any) => Song.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => Song.findByIdAndDelete(id),
};