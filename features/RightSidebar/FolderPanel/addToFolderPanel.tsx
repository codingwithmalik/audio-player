// features/RightSidebar/AddToFolderPanel.tsx
"use client";

export default function AddToFolderPanel({ folderId }: { folderId: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-white/40 text-sm">
      Add to folder ({folderId}) — coming soon
    </div>
  );
}
