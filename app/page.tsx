"use client";

import "../styles/backgrounds.css";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import HomeSections from "@/features/Home/HomeSections";

export default function Home() {
  return (
    <div className="flex items-center justify-center glass h-full w-auto overflow-hidden md:rounded-lg">
      <OverlayScrollbarsComponent
        defer
        options={{
          scrollbars: {
            theme: "os-theme-light",
            autoHide: "leave",
            autoHideDelay: 0,
          },
        }}
        className="h-full w-full"
      >
        <div className="overflow-y-auto">
          <HomeSections />
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
}