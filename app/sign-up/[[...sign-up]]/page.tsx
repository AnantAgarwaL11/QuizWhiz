import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f8] flex items-center justify-center">
      <SignUp />
    </main>
  );
}
