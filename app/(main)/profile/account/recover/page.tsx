"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectDeletedPlaylists,
  restorePlaylist,
  removePlaylist,
} from "@/features/Playlist/playlistSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog"; // adjust to actual path

const TRASH_RETENTION_DAYS = 90; // kept in sync with playlistsSlice's own constant

function daysRemaining(deletedAt: string): number {
  const deletedDate = new Date(deletedAt);
  const expiry = new Date(deletedDate);
  expiry.setDate(expiry.getDate() + TRASH_RETENTION_DAYS);
  const msRemaining = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export default function RecoverPlaylistsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deletedPlaylists = useAppSelector(selectDeletedPlaylists);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="h-full"
      defer
    >
      <div className="p-6 flex flex-col gap-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div>
          <h1 className="text-3xl font-extrabold mb-2">Recover playlists</h1>
          <p className="text-sm text-white/60">
            If you deleted a playlist within the last {TRASH_RETENTION_DAYS} days, you can get it back.
          </p>
        </div>

        {deletedPlaylists.length === 0 ? (
          <p className="text-sm text-white/50">Nothing in your trash right now.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/50 border-b border-white/10">
                <th className="py-2 font-medium">Deleted</th>
                <th className="py-2 font-medium">Title</th>
                <th className="py-2 font-medium">Songs</th>
                <th className="py-2 font-medium">Expires in</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {deletedPlaylists.map((playlist) => (
                <tr key={playlist.id} className="border-b border-white/5">
                  <td className="py-3 text-white/70">{formatDate(playlist.deletedAt!)}</td>
                  <td className="py-3">{playlist.title}</td>
                  <td className="py-3 text-white/70">{playlist.songs.length}</td>
                  <td className="py-3 text-white/70">{daysRemaining(playlist.deletedAt!)} days</td>
                  <td className="py-3 flex gap-2 justify-end">
                    <button
                      onClick={() => dispatch(restorePlaylist(playlist.id))}
                      className="px-4 py-1.5 rounded-full border border-white/30 text-xs font-semibold hover:bg-white/10"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(playlist.id)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-red-400 hover:bg-red-950/40"
                    >
                      Delete forever
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmingDeleteId && (
        <ConfirmDialog
          open={!!confirmingDeleteId}
          title="Delete this playlist forever?"
          description="This can't be undone."
          confirmLabel="Delete forever"
          onConfirm={() => {
            dispatch(removePlaylist(confirmingDeleteId));
            setConfirmingDeleteId(null);
          }}
          onCancel={() => setConfirmingDeleteId(null)}
        />
      )}
    </OverlayScrollbarsComponent>
  );
}