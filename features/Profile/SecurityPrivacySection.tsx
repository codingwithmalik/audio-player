"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import ConfirmDialog from "@/features/Common/ConfirmDialog";

export default function SecurityPrivacySection() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSigningOutEverywhere, setIsSigningOutEverywhere] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSignOutEverywhere() {
    if (isSigningOutEverywhere) return;
    setIsSigningOutEverywhere(true);
    await signOut({ callbackUrl: "/login" });
  }

  async function handleDeleteAccount() {
    if (isDeleting) return;
    setIsDeleting(true);
    await signOut({ callbackUrl: "/login" });
  }

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="flex flex-col gap-8 max-w-md">
      <h2 className="text-xl font-bold">Security & Privacy</h2>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-3 rounded-md bg-red-950/40 px-4 py-3 text-sm text-red-400 transition hover:bg-red-950/60 disabled:opacity-50"
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
      <button
        onClick={handleSignOutEverywhere}
        disabled={isSigningOutEverywhere}
        className="text-left px-4 py-3 rounded-md bg-white/5 hover:bg-white/10 text-sm font-medium disabled:opacity-50"
      >
        {isSigningOutEverywhere ? "Signing out..." : "Sign out everywhere"}
      </button>

      <button
        onClick={() => setConfirmingDelete(true)}
        className="text-left px-4 py-3 rounded-md bg-red-950/40 hover:bg-red-950/60 text-sm font-medium text-red-400"
      >
        Delete account
      </button>

      {confirmingDelete && (
        <ConfirmDialog
          open={confirmingDelete}
          title="Delete your account?"
          description="This permanently removes your account and all your data. This can't be undone."
          confirmLabel={isDeleting ? "Deleting..." : "Delete account"}
          onConfirm={handleDeleteAccount}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
