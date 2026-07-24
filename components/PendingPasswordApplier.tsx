"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { consumePendingPassword } from "@/utils/pendingPassword";

export default function PendingPasswordApplier() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const pending = consumePendingPassword(session.user.email);
    if (!pending) return;

    fetch("/api/account/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: pending }),
    }).catch(() => {
      // Silent failure is acceptable here — worst case, the person just
      // hasn't got a password set yet and can retry via Settings later.
    });
  }, [status, session]);

  return null;
}
