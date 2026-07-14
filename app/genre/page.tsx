"use client";

import BrowseGrid from "@/features/Genre/BrowseGrid";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function GenrePage() {
  return (
    <OverlayScrollbarsComponent
      defer
      options={{
        scrollbars: {
          theme: "os-theme-light",
          autoHide: "leave",
          autoHideDelay: 0,
        },
      }}
      className="h-full w-full glass rounded-md"
    >
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white mb-6">Browse all</h1>
        <BrowseGrid />
      </div>
    </OverlayScrollbarsComponent>
  );
}
