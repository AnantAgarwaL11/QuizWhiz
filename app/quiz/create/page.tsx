"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Question = {
  text: string;
  options: string[];
  correctIndex: number;
};
const emptyQuestion = (): Question => ({
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});
export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateQuestion = (i: number, value: string) => {
    setQuestions((prev) => {
      const u = [...prev];
      u[i] = { ...u[i], text: value };
      return u;
    });
  };
  const updateOption = (qi: number, oi: number, value: string) => {
    setQuestions((prev) => {
      const u = [...prev];
      u[qi].options[oi] = value;
      return u;
    });
  };
  const setCorrect = (qi: number, oi: number) => {
    setQuestions((prev) => {
      const u = [...prev];
      u[qi] = { ...u[qi], correctIndex: oi };
      return u;
    });
  };
  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
    setTimeout(
      () =>
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        }),
      100,
    );
  };
  const removeQuestion = (i: number) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  };
  const publish = async () => {
    if (!title.trim()) return setError("Please Add a Title");
    for (const q of questions) {
      if (!q.text.trim()) return setError("All questions need Text");
      if (q.options.some((o) => !o.trim())) {
        return setError("All options must be filled in");
      }
    }
    setError("");
    setSaving(true);
    const res = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, questions }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Something went wrong");
      setSaving(false);
    }
  };
  return (
    <main className="min-h-screen">
      <nav
        className="bg-yellow-300/90 backdrop-blur-md border-8 shadow-brutal 
       border-black rounded-3xl px-6 py-4 flex items-center justify-between sticky top-4 z-10 mx-4"
      >
        <Link href="/dashboard">
          <Button className="text-white bg-black p-2 rounded-xl border-white border-2 shadow-brutal cursor-pointer">
            ← back
          </Button>
        </Link>
        <span className="text-xl md:text-2xl font-bold text-black text-center">
          Create Quiz
        </span>
        <Button
          onClick={publish}
          disabled={saving}
          className="bg-black text-white border-2 border-white shadow-brutal cursor-pointer text-sm font-medium px-5 py-2 rounded-xl disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish"}
        </Button>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-white/80 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100">
            {error} :(
          </div>
        )}
      </div>
      <Card className="max-w-2xl mx-auto bg-transparent rounded-xl p-5 mt-8 flex flex-col  items-center">
        <CardHeader>
          <CardTitle>Fill the Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mt-12 gap-2">
            <label className="w-32 text-lg  text-gray-900 whitespace-nowrap font-semibold">
              Quiz Title:
            </label>
            <input
              className="flex-1 w-full text-md font-medium text-gray-900 border-2 border-black 
        placeholder-gray-900 mb-3 px-3 py-2 outline-none rounded-md focus:border-gray-500"
              placeholder=" Quiz Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-2">
            <label
              htmlFor=""
              className="w-32 text-lg text-gray-900 whitespace-nowrap font-semibold"
            >
              Description:
            </label>
            <input
              type="text"
              className="flex-1 w-full  text-md font-medium text-gray-900 border-2 border-black
        placeholder-gray-900 mb-3 px-3 py-2 outline-none rounded-md focus:border-gray-500"
              placeholder=" Short Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-900 text-sm font-medium">Questions</p>
            <p className="text-xs text-gray-400">{questions.length} added</p>
          </div>
          <AnimatePresence>
            {questions.map((q, qi) => (
              <motion.div
                key={qi}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/20 rounded-xl border border-black p-5 mb-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-400">
                    Question {qi + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qi)}
                      className="text-xs bg-black rounded-full cursor-pointer p-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  className="w-full text-md text-gray-900 bg-transparent border border-black
                py-2 rounded-md outine-none mb-4  px-3  outline-none  focus:border-gray-500"
                  placeholder=" Type your question..."
                  value={q.text}
                  onChange={(e) => updateQuestion(qi, e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      onClick={() => setCorrect(qi, oi)}
                      className={`flex items-center gap-2 p-3 rounded-lg border 
                        cursor-pointer transition-all text-sm ${
                          q.correctIndex === oi ?
                            "border-green-300 bg-green-50/50 text-black"
                          : "border-gray-100 hover:border-gray-300 text-gray-900"
                        }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-[1.5px] flex
                           items-center justify-center shrink-0 transition-colors
                           ${q.correctIndex === oi ? "border-green-600" : "border-gray-300"}
                           `}
                      >
                        {q.correctIndex === oi && (
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        )}
                      </div>
                      <input
                        className="flex-1 bg-transparent text-inherit text-sm  outline-none rounded-md focus:border-gray-500"
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        value={opt}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Click an option to mark it correct.
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          <CardFooter>
            <Button onClick={addQuestion}>+ Add Question</Button>
          </CardFooter>
        </CardContent>
      </Card>
    </main>
  );
}
