"use client";
import { Library } from "lucide-react";
import CreateButton from "./libraryHeaderCreateButton";

export default function LibraryHeader() {
  return (
    <div className="lg:flex-row flex items-center justify-between md:flex-col md:gap-4">
      <div className="flex items-center gap-3">
        <Library />
        <h2 className="md:hidden lg:block text-lg font-semibold">Your Library</h2>
      </div>
      <CreateButton/>
    </div>
  );
}
