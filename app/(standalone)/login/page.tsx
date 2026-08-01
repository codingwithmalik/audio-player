// app/(standalone)/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "@/features/Auth/Login/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-8">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
