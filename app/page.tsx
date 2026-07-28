import { Card } from "@/components/ui/card";
import FloatingShapes from "@/components/ui/floatingShapes";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main
      className="min-h-screen flex items-center
  justify-center px-6"
    >
      {/* <div className="hidden md:block z-5">
        <FloatingShapes />
      </div> */}
      <Card className="p-8 rounded-lg border-4 border-black shadow-brutal">
        <div className="text-center max-w-md">
          <div className="w-11 h-11 bg-black rounded-xl mx-auto mb-6 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            QuzWhiz
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Create Quizzes, share with anyone, watch scores in live.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/sign-up">
              <button
                className="w-full bg-black text-white text-sm font-medium
            py-3 rounded-xl hover:opacity-70 transition-opacity cursor-pointer"
              >
                Get Started Free
              </button>
            </Link>
            <Link href="/sign-in">
              <button
                className="w-full bg-white text-gray-700 text-sm font-medium py-3 rounded-xl
           border-black hover:border-black/50 transition-colors cursor-pointer border-4 shadow-brutal
           "
              >
                Sign in
              </button>
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-5">
            Free Forever. No Credit Card Needed.
          </p>
        </div>
      </Card>
    </main>
  );
}
