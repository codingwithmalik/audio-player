"use client";

import Link from "next/link";
import { ChevronRight, RotateCcw } from "lucide-react";
import PersonalInfoForm from "./PersonalInfoForm";

export default function AccountSection() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <PersonalInfoForm />
      </div>

      <Link
        href="/profile/account/recover"
        className="flex items-center justify-between p-4 rounded-md bg-white/5 hover:bg-white/10 transition-colors max-w-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Recover playlists</span>
        </div>
        <ChevronRight className="w-4 h-4 text-white/40" />
      </Link>
    </div>
  );
}
