"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { storePendingPassword } from "@/utils/pendingPassword";
import PasswordInput from "@/features/Auth/components/PasswordInput";
import GoogleIcon from "@/icons/GoogleIcon";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Something went wrong linking your account. Please try again.",
  OAuthSignin: "Couldn't start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  CredentialsSignin: "Invalid email or password.",
  EmailSignin: "Couldn't send the sign-in email. Please try again.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        ERROR_MESSAGES[error] || "Something went wrong. Please try again.",
      );
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
      return;
    }

    if (res?.error === "NO_PASSWORD_SET") {
      storePendingPassword(email, password);
      await signIn("email", { email, redirect: false, callbackUrl: "/" });
      router.push("/verify-request");
      return;
    }

    toast.error("Invalid email or password");
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Log in to Audious</h1>

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

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-neutral-400 hover:text-white"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-neutral-500">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 py-3 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-white hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
