// features/Profile/components/ProfileHeaderCard.tsx
"use client";

import Image from "next/image";
import { useAppSelector } from "@/globalHooks";

// Deterministic color per user so the same person always gets the same
// avatar color across sessions, rather than a random one on every render.
const AVATAR_COLORS = [
  "bg-purple-600",
  "bg-blue-600",
  "bg-pink-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-red-600",
];

function getAvatarColor(username: string) {
  const charSum = username
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[charSum % AVATAR_COLORS.length];
}

export default function ProfileHeaderCard({
  playlistCount,
}: {
  playlistCount: number;
}) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <div className="flex items-center gap-6 overflow-x-hidden">
      {user.image ? (
        <div className="relative w-24 h-24 max-md:w-12 max-md:h-12 rounded-full overflow-hidden shrink-0">
          <Image
            src={user.image}
            alt={user.username}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={`w-24 h-24 max-md:w-18 max-md:h-18 rounded-full flex items-center justify-center text-4xl font-bold text-white shrink-0 ${getAvatarColor(user.username)}`}
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-white/60">Profile</p>
        <h1 className="max-md:text-2xl md:text-3xl lg:text-4xl font-extrabold">
          {user.username}
        </h1>
        <p className="text-sm text-white/60 mt-1">
          {playlistCount} {playlistCount === 1 ? "Playlist" : "Playlists"}
        </p>
      </div>
    </div>
  );
}
