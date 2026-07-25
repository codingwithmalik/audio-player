import { Schema, models, model } from "mongoose";

const FolderSchema = new Schema(
  {
    title: { type: String, required: true },
    ownerId: { type: String, required: true, ref: "UserProfile" },
  },
  { timestamps: true },
);

FolderSchema.index({ ownerId: 1 });

FolderSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default models.Folder || model("Folder", FolderSchema);
