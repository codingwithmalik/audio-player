import { Schema, models, model } from "mongoose";

const FolderSchema = new Schema(
  {
    title: { type: String, required: true },
    ownerId: { type: String, required: true, ref: "UserProfile" },
  },
  { timestamps: true },
);

FolderSchema.index({ ownerId: 1 });

export default models.Folder || model("Folder", FolderSchema);