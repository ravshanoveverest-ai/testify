import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  examType: { type: String, enum: ["test", "written"], default: "test" },
  maxScore: { type: Number, required: true, default: 100 },
  totalQuestions: { type: Number, required: true },
  questionsPerStudent: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  questions: [{
    text: String,
    options: [String],
    answer: String
  }],
  passcodes: [{
    code: String,
    usedBy: { type: String, default: null },
    score: { type: Number, default: null },
    status: { type: String, enum: ["unused", "completed"], default: "unused" },
    studentAnswers: { type: Object, default: {} },
    
    // YANGILIK: AI ning har bir savol bo'yicha bergan izohi va ballini saqlaymiz!
    aiEvaluation: { type: Object, default: {} } 
  }]
}, { timestamps: true });

// Keshni tozalash
if (mongoose.models.Exam) {
  delete mongoose.models.Exam;
}

const Exam = mongoose.model("Exam", examSchema);
export default Exam;