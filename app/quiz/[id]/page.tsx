"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import Link from "next/link";

type Question = { text: string; options: string[]; _id: string };
type Quiz = {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
};

export default function TakeQuiz() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(
    null,
  );

  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      });
  }, [id]);

  const handleNext = () => {
    if (selected === null || !quiz) return;
    const correctIndex = (quiz.questions[current] as any).correctIndex;
    setShowResult(selected === correctIndex ? "correct" : "wrong");

    setTimeout(() => {
      const newAnswers = [...answers, selected];
      setAnswers(newAnswers);
      setSelected(null);
      setShowResult(null);

      if (current + 1 < quiz.questions.length) {
        setCurrent((c) => c + 1);
      } else {
        submitQuiz(newAnswers);
      }
    }, 700);
  };

  const submitQuiz = async (finalAnswers: number[]) => {
    setSubmitting(true);
    const res = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: id, answers: finalAnswers }),
    });

    if (res.status === 400) {
      setAlreadyDone(true);
      setSubmitting(false);
      return;
    }

    getSocket().emit("new-attempt", id);
    router.push(`/quiz/${id}/results`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md px-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-white border border-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div
        className="min-h-screen flex items-center
                      justify-center px-6"
      >
        <div className="text-center">
          <p className="text-gray-900 font-medium mb-2">
            You have already attempted this quiz
          </p>
          <Link href={`/quiz/${id}/results`}>
            <button className="text-sm text-gray-500 hover:text-gray-900 underline">
              View leaderboard →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">This quiz has no questions yet.</p>
      </div>
    );
  }

  const q = quiz.questions[current];
  const progress = (current / quiz.questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col">
      <div className="w-full h-0.5 bg-gray-100">
        <motion.div
          className="h-full bg-gray-900"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs sm:text-md text-gray-900 font-semibold tracking-tight truncate max-w-50">
              {quiz.title}
            </p>
            <p className="text-xs sm:text-md text-gray-700">
              {current + 1} / {quiz.questions.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-snug">
                {q.text}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  let cls =
                    "w-full text-left px-4 py-3.5 rounded-xl border " +
                    "text-sm transition-all flex items-center gap-3 " +
                    "font-[inherit] cursor-pointer ";

                  if (showResult !== null) {
                    if (i === selected && showResult === "correct")
                      cls += "border-green-400 bg-green-100 text-green-800";
                    else if (i === selected && showResult === "wrong")
                      cls += "border-red-300 bg-red-100 text-red-700";
                    else cls += "border-gray-100 bg-white text-gray-400";
                  } else if (selected === i) {
                    cls += "border-gray-900 bg-gray-900 text-white";
                  } else {
                    cls +=
                      "border-gray-200 bg-white text-gray-700 hover:border-gray-400";
                  }

                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => showResult === null && setSelected(i)}
                      className={cls}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border flex items-center
                                    justify-center text-xs font-medium shrink-0
                                    ${
                                      selected === i && showResult === null ?
                                        "border-white text-white"
                                      : "border-gray-300 text-gray-400"
                                    }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                disabled={
                  selected === null || submitting || showResult !== null
                }
                className="w-full mt-6 bg-black text-white py-3.5 rounded-xl
                           text-sm font-medium disabled:opacity-30
                           transition-opacity"
              >
                {submitting ?
                  "Submitting..."
                : current + 1 === quiz.questions.length ?
                  "Submit quiz"
                : "Next →"}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
