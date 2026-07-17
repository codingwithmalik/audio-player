"use client";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/backgrounds.css";
import Library from "@/features/LeftSidebar/Library/library";
import LocalFilesSection from "@/features/LeftSidebar/LocalFiles/LocalFilesSection";
import { useAppSelector } from "@/globalHooks";
import { selectLibrarySettings } from "@/features/Profile/settingsSlice";
import { useIsMobile } from "@/hooks/useIsMobile";

type SidebarTab = "library" | "localFiles";
const LeftSidebar = () => {
  const { showDownloadedSongs } = useAppSelector(selectLibrarySettings);
  const isMobile =useIsMobile()
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("library");
  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      {
        x: -40,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
    );
  }, []);
  if (showDownloadedSongs && !isMobile)
    return (
      <div
        className="md:flex flex-col w-full min-h-full overflow-hidden glass hidden rounded-lg"
        ref={sidebarRef}
      >
        <div className="flex gap-1 p-2 bg-inherit">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 py-2  text-xs font-semibold transition-colors ${
              activeTab === "library"
                ? " text-white border-b border-purple-600"
                : " text-white/30 hover:text-white/50"
            }`}
          >
            Your Library
          </button>
          <button
            onClick={() => setActiveTab("localFiles")}
            className={`flex-1 py-2  text-xs font-semibold transition-colorst  ${
              activeTab === "localFiles"
                ? " text-white  border-b border-purple-600"
                : " text-white/30 hover:text-white/50"
            }`}
          >
            Local Files
          </button>
        </div>
        {activeTab === "library" ? <Library /> : <LocalFilesSection />}
      </div>
    );
  return (
    <div
      className="md:flex flex-col w-full min-h-full overflow-hidden glass hidden rounded-lg"
      ref={sidebarRef}
    >
      <Library />
    </div>
  );
};

export default LeftSidebar;
