import mongoose, { Schema } from "mongoose";

const blockSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "📁" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Block = mongoose.models.Block || mongoose.model("Block", blockSchema);
export default Block;