import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDb();
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { userId } = await auth();
  console.log("userId from clerk:", userId);
  console.log("creatorId in db:", quiz.creatorId);
  console.log("isCreator:", userId === quiz.creatorId);
  const isCreator = userId === quiz.creatorId;
  if (isCreator) {
    return NextResponse.json(quiz);
  }
  const safeQuiz = quiz.toObject();
  safeQuiz.questions = safeQuiz.questions.map((q: any) => ({
    _id: q._id,
    text: q.text,
    options: q.options,
  }));
  return NextResponse.json(safeQuiz);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDb();
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (quiz.creatorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await quiz.deleteOne();
  return NextResponse.json({ success: true });
}
