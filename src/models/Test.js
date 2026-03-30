import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
  {
    blockId: { type: String, required: true },
    title: { type: String, required: true },
    visibility: { type: String, default: "Private" },
    questions: { type: Array, required: true },
    questionCount: { type: Number, default: 0 },
    format: { type: String, default: "txt" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  },
  { timestamps: true }
);

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);
export default Test;