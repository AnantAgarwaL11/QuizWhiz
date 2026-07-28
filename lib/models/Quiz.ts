import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
});
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
