import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";
import { connectDb } from "@/lib/mongodb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const quizId = req.nextUrl.searchParams.get("quizId");
  if (!quizId) {
    return NextResponse.json({ error: "" }, { status: 400 });
  }
  await connectDb();
  const attempts = await Attempt.find({ quizId })
    .sort({ score: -1, createdAt: 1 })
    .limit(50);
  return NextResponse.json(attempts);
}
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { quizId, answers } = await req.json();
  await connectDb();
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz Not found" }, { status: 404 });
  }
  const existing = await Attempt.findOne({ quizId, userId });
  if (existing) {
    return NextResponse.json({ error: "Already Completed" }, { status: 400 });
  }
  let score = 0;
  quiz.questions.forEach((q: any, i: number) => {
    if (answers[i] === q.correctIndex) score++;
  });
  const attempt = await Attempt.create({
    quizId,
    userId,
    userName: `${user.firstName} ${user.lastName}`.trim(),
    userImage: user.imageUrl || "",
    answers,
    score,
    total: quiz.questions.length,
  });
  return NextResponse.json(attempt);
}
