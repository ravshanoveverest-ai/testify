import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testId: { type: String, required: true },
    testTitle: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timeSpent: { type: Number, default: 0 }, // Soniyalarda saqlaymiz
  },
  { timestamps: true }
);

const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
export default Result;