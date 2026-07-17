"use client";

import { useState } from "react";
import { useAppDispatch } from "@/globalHooks";
// import { signOut } from "next-auth/react";
import { logout } from "@/features/Auth/authSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog"; // adjust to actual path
import { LogOut } from "lucide-react";

export default function SecurityPrivacySection() {
  const dispatch = useAppDispatch();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleSignOutEverywhere() {
    // ─── MOCK: replace with a real "revoke all sessions" API call ───
    dispatch(logout());
    // await signOut({ callbackUrl: "/login" });
  }

  async function handleDeleteAccount() {
    // ─── MOCK: replace with a real account-deletion API call ───
    dispatch(logout());
    // await signOut({ callbackUrl: "/login" });
  }

  async function handleLogout() {
    // ─── MOCK: replace with a real account-deletion API call ───
    dispatch(logout());
    // await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="flex flex-col gap-8 max-w-md">
      <h2 className="text-xl font-bold">Security & Privacy</h2>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md  bg-red-950/40 px-4 py-3 text-sm text-red-400 transition hover:bg-red-950/60"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
      <button
        onClick={handleSignOutEverywhere}
        className="text-left px-4 py-3 rounded-md bg-white/5 hover:bg-white/10 text-sm font-medium"
      >
        Sign out everywhere
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
          confirmLabel="Delete account"
          onConfirm={handleDeleteAccount}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
