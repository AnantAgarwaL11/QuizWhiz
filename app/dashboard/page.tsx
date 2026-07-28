"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Quiz = {
  _id: string;
  title: string;
  description: string;
  questions: any[];
  published: boolean;
  createdAt: string;
};
export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) fetchQuizzes();
  }, [isLoaded]);

  const fetchQuizzes = async () => {
    const res = await fetch("/api/quizzes");
    const data = await res.json();
    setQuizzes(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  const deleteQuiz = async (id: string) => {
    if (!confirm("Delete this quiz")) return;
    await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
    setQuizzes((prev) => prev.filter((q) => q._id !== id));
  };
  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen">
        <nav
          className="bg-yellow-300/90 backdrop-blur-md border-8 shadow-brutal
         border-black rounded-3xl px-6 py-6 flex items-center justify-between sticky top-4 z-10 mx-4 mb-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg md:text-xl">
              QuzWhiz
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/20 animate-pulse" />
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-8 mt-4">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {["bg-purple-200", "bg-yellow-400", "bg-red-300"].map(
              (color, i) => (
                <div
                  key={i}
                  className={`${color} rounded-xl p-4 animate-pulse`}
                >
                  <div className="h-7 w-8 bg-black/10 rounded mx-auto mb-2" />
                  <div className="h-4 w-16 bg-black/10 rounded mx-auto" />
                </div>
              ),
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 mt-2 animate-pulse"
            >
              <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
              <div className="h-3 w-32 bg-gray-100 rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-7 w-14 bg-gray-100 rounded-lg" />
                <div className="h-7 w-16 bg-gray-100 rounded-lg" />
                <div className="h-7 w-14 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen">
      <nav
        className="bg-yellow-300/90 backdrop-blur-md border-8 shadow-brutal
       border-black rounded-3xl px-6 py-6 flex items-center justify-between sticky top-4 z-10 mx-4 mb-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-semibold text-gray-900 text-lg md:text-xl ">
            QuzWhiz
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">
            {user?.firstName}
          </span>
          <UserButton />
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-8 mt-4">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Quizzes", value: quizzes.length, color: "bg-purple-200" },
            {
              label: "Questions",
              value: quizzes.reduce((a, q) => a + q.questions.length, 0),
              color: "bg-yellow-400",
            },
            {
              label: "Published",
              value: quizzes.filter((q) => q.published).length,
              color: "bg-red-300",
            },
          ].map((s) => (
            <Card className={s.color} key={s.label}>
              <CardTitle className="text-xl text-center md:text-2xl">
                {s.value}
              </CardTitle>
              <CardContent className="text-md md:text-lg text-center">
                {s.label}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Your Quizzes</h1>
          <Link href="/quiz/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-black text-white text-sm px-4 py-2 rounded-full flex items-center gap-1.5 
              cursor-pointer border-4 border-white shadow-brutal"
            >
              <span className="text-base leading-none">+</span> New Quiz
            </motion.button>
          </Link>
        </div>

        {quizzes.length === 0 ?
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-12 h-12 bg-gray-100 text-black rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
              ?
            </div>
            <p className="text-gray-500 text-md">No Quizzes yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first one above.
            </p>
          </motion.div>
        : <AnimatePresence>
            {quizzes.map((quiz, i) => (
              <Card key={quiz._id} className="mt-2">
                <CardTitle>{quiz.title}</CardTitle>
                <CardContent>
                  <p className="text-xs text-gray-900">
                    {quiz.questions.length} questions{" "}
                    {new Date(quiz.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyLink(quiz._id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:text-gray-500
                  text-gray-900 hover:border-gray-300 transition-all cursor-pointer shadow-brutal"
                  >
                    {copied === quiz._id ? "Copied" : "Share"}
                  </motion.button>
                  <Link href={`/quiz/${quiz._id}/results`}>
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-brutal hover:text-gray-500 text-gray-900
                  hover:border-gray-300 transition-all cursor-pointer"
                    >
                      Results
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteQuiz(quiz._id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-red-600 hover:text-red-800
                  hover:border-red-200 transition-all shadow-brutal cursor-pointer"
                  >
                    Delete
                  </button>
                </CardFooter>
              </Card>
            ))}
          </AnimatePresence>
        }
      </div>
    </main>
  );
}
