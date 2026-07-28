import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f8] flex items-center justify-center">
      <SignIn />
    </main>
  );
}
