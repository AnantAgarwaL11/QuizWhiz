import { Server } from "socket.io";
import { NextResponse } from "next/server";

declare global {
  var _io: Server | undefined;
}

export async function GET() {
  if (!global._io) {
    const io = new Server({
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
      socket.on("join-quiz", (quizId: string) => {
        socket.join(quizId);
      });
      socket.on("new-attempt", (quizId: string) => {
        io.to(quizId).emit("Leaderboard Update");
      });
    });
    global._io = io;
  }
  return NextResponse.json({ ok: true });
}
