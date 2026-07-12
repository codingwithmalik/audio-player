// features/RightSidebar/AddToPlaylistPanel.tsx
"use client";

export default function AddToPlaylistPanel({ playlistId }: { playlistId: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-white/40 text-sm">
      Add to playlist ({playlistId}) — coming soon
    </div>
  );
}