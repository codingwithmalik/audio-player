"use client";
import { Library, Plus } from "lucide-react";

export default function LibraryHeader() {
  return (
    <div className="lg:flex-row flex items-center justify-between md:flex-col md:gap-4">
      <div className="flex items-center gap-3">
        <Library />
        <h2 className="md:hidden lg:block text-lg font-semibold">Your Library</h2>
      </div>
      <button className="bg-white/10 hover:bg-white/20 transition rounded-full p-2 lg:px-4 flex items-center gap-2">
        <Plus size={18} />
        <span className="hidden lg:block">Create</span>
      </button>
    </div>
  );
}
