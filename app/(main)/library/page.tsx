import React from "react";
import Library from "@/features/LeftSidebar/Library/library";

const LibraryPage = () => {
  return (
    <div className="flex items-center justify-center glass h-full w-auto overflow-hidden md:rounded-lg" >
      <Library scrollable />
    </div>
  );
};

export default LibraryPage;
