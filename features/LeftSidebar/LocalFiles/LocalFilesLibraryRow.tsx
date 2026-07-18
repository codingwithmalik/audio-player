"use client";

import { HardDrive } from "lucide-react";
import { useAppSelector } from "@/globalHooks";
import { selectLocalFileCount } from "./localFilesSlice";

export default function LocalFilesLibraryRow({
  onClick,
}: {
  onClick: () => void;
}) {
  const count = useAppSelector(selectLocalFileCount);

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl lg:p-1 pl-0 py-1 md:hover:bg-white/10 transition cursor-pointer"
    >
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        <div className="w-13 h-13 aspect-square rounded-md bg-linear-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          <HardDrive className="w-6 h-6 text-white/80" />
        </div>
      </div>

      <div className="md:hidden lg:block">
        <h3 className="text-white font-medium">Local Files</h3>
        <p className="text-sm text-zinc-400">
          {count} {count === 1 ? "song" : "songs"}
        </p>
      </div>
    </div>
  );
}
