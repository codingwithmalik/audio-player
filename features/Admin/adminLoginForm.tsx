// app/admin/login/AdminLoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import PasswordInput from "@/features/Auth/components/PasswordInput";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      const callbackUrl = searchParams.get("callbackUrl") || "/admin";
      router.push(callbackUrl);
      return;
    }

    toast.error("Invalid email or password");
    setIsSubmitting(false);
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Password"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
