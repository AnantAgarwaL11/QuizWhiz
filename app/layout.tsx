import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import FloatingShapes from "@/components/ui/floatingShapes";

export const metadata: Metadata = {
  title: "QuzWhiz",
  description: "Create and share quizzes with live leaderboards",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={` h-full antialiased`}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-neutral-900 min-h-screen`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200">
            <div className="hidden md:block z-5">
              <FloatingShapes />
            </div>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
