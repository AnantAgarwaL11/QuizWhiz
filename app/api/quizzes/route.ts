import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDb();
  const quizzes = await Quiz.find({ creatorId: userId }).sort({
    createdAt: -1,
  });
  return NextResponse.json(quizzes);
}
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, description, questions } = await req.json();
  if (!title || !questions || questions.length === 0) {
    return NextResponse.json(
      { error: "Title and description required" },
      { status: 400 },
    );
  }
  await connectDb();
  const quiz = await Quiz.create({
    title,
    description,
    questions,
    creatorId: userId,
    creatorName: `${user.firstName} ${user.lastName}`.trim(),
    published: true,
  });
  return NextResponse.json(quiz);
}
