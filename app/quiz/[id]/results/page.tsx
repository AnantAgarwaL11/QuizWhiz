"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getSocket } from "@/lib/socket";
import Link from "next/link";
import { animate } from "framer-motion";
import { Button } from "@/components/ui/button";

type Attempt = {
  _id: string;
  userName: string;
  userId: string;
  score: number;
  total: number;
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value]);
  return <>{display}</>;
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttempts = async () => {
    const res = await fetch(`/api/attempts?quizId=${id}`);
    const data = await res.json();
    setAttempts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttempts();
    const socket = getSocket();
    socket.emit("join-quiz", id);
    socket.on("leaderboard-update", fetchAttempts);
    return () => {
      socket.off("leaderboard-update", fetchAttempts);
    };
  }, [id]);

  const myAttempt = attempts.find((a) => a.userId === user?.id);
  const myRank = myAttempt ? attempts.indexOf(myAttempt) + 1 : null;
  const pct =
    myAttempt ? Math.round((myAttempt.score / myAttempt.total) * 100) : null;

  return (
    <main className="min-h-screen">
      <nav
        className="bg-yellow-300/90 backdrop-blur-md border-8 shadow-brutal 
       border-black rounded-3xl px-6 py-4 flex items-center justify-between sticky top-4 z-10 mx-4"
      >
        <Link href="/dashboard">
          <Button className="text-white bg-black p-2 rounded-xl border-white border-2 shadow-brutal cursor-pointer">
            ← Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        {myAttempt && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-8
                       text-center mb-8"
          >
            <div
              className="w-20 h-20 rounded-full border-2 border-gray-900
                            mx-auto flex flex-col items-center justify-center mb-4"
            >
              <span className="text-2xl font-semibold text-gray-900 leading-none">
                <AnimatedNumber value={myAttempt.score} />
              </span>
              <span className="text-xs text-gray-400">
                of {myAttempt.total}
              </span>
            </div>
            <p className="text-gray-900 font-medium">
              {pct! >= 80 ?
                "Great job!"
              : pct! >= 50 ?
                "Not bad!"
              : "Keep practising!"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {pct}% · Rank #{myRank} of {attempts.length}
            </p>
          </motion.div>
        )}

        {!myAttempt && !loading && (
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6
                          text-center mb-8"
          >
            <p className="text-sm text-gray-500">
              You haven't attempted this quiz yet.
            </p>
            <Link href={`/quiz/${id}`}>
              <button className="mt-3 text-sm text-gray-900 font-medium underline">
                Take it now →
              </button>
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-900">Leaderboard</p>
          <p className="text-xs text-gray-400">{attempts.length} attempts</p>
        </div>

        {loading ?
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-white border border-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        : <div className="space-y-2">
            {attempts.map((a, i) => {
              const isMe = a.userId === user?.id;
              const barWidth = Math.round((a.score / a.total) * 100);
              return (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-white rounded-xl border px-4 py-3
                              flex items-center gap-3
                              ${isMe ? "border-gray-900" : "border-gray-100"}`}
                >
                  <span
                    className={`text-xs font-medium w-5 shrink-0
                                    ${i === 0 ? "text-amber-500" : "text-gray-400"}`}
                  >
                    {i + 1}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center
                                   justify-center text-xs font-medium shrink-0
                                   ${
                                     isMe ?
                                       "bg-gray-900 text-white"
                                     : "bg-gray-100 text-gray-500"
                                   }`}
                  >
                    {a.userName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate
                                   ${
                                     isMe ?
                                       "font-medium text-gray-900"
                                     : "text-gray-700"
                                   }`}
                    >
                      {isMe ? "You" : a.userName}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }}
                        className="h-full bg-gray-900 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 shrink-0">
                    {a.score}/{a.total}
                  </span>
                </motion.div>
              );
            })}
          </div>
        }
      </div>
    </main>
  );
}
