"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { storePendingPassword } from "@/utils/pendingPassword";
import PasswordInput from "@/features/Auth/components/PasswordInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsSubmitting(true);
    storePendingPassword(email, newPassword);
    await signIn("email", { email, redirect: false , callbackUrl:"/"});
    router.push("/verify-request");
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-8">
      <h1 className="mb-2 text-2xl font-bold text-white">
        Reset your password
      </h1>
      <p className="mb-6 text-sm text-neutral-400">
        Enter your email and a new password — we&apos;ll send a link to confirm
        it&apos;s you.
      </p>

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
          value={newPassword}
          onChange={setNewPassword}
          placeholder="New password"
        />
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm new password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send verification link"}
        </button>
      </form>
    </div>
  );
}
