"use client";
import React, { useState, useCallback } from "react";
import Header from "../components/header";
import Player from "@/features/Player/player";
import Rightsidebar from "@/components/rightsidebar";


import LeftSidebar from "@/components/leftsidebar";
import BottomNav from "@/components/mobileNavbar";
import NowPlayingView from "@/features/Player/NowPlayingView";
import { selectCurrentSong, selectIsNowPlayingOpen } from "@/slices/playerSlice";
import { useAppSelector } from "@/globalHooks";
import RightSidebarPanelOverlay from "@/features/RightSidebar/RightSidebarPanelOverlay";
import { usePanelWidths } from "@/hooks/usePanelWidths";
import ResizeHandle from "@/features/Common/ResizeHandle";
import { selectRightSidebarPanel } from "@/slices/rightSidebarSlice";
import { selectisAuthenticated } from "@/features/Auth/authSlice";
import useGlobalKeyboardShortcuts from "@/hooks/useGlobalKeyboardShortcuts";

const LayoutContent = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  useGlobalKeyboardShortcuts()
  const isNowPlayingOpen = useAppSelector(selectIsNowPlayingOpen);
  const currentSong = useAppSelector(selectCurrentSong);
  const rightPanel = useAppSelector(selectRightSidebarPanel);
  const isAuthenticated = useAppSelector(selectisAuthenticated);
  const { leftWidth, rightWidth, adjustLeftWidth, adjustRightWidth } =
    usePanelWidths();

  // No isWideLayout check here anymore — CSS (`hidden lg:block`) decides
  // whether the right sidebar can physically fit. This is purely "should
  // it show given the current tab/song," which is Redux-derived and
  // therefore identical on server and client — no hydration risk.
  const isRightSidebarVisible = rightPanel.tab !== "default" || !!currentSong;

  const [showNowPlayingSlot, setShowNowPlayingSlot] =
    useState(isNowPlayingOpen);

  if (isNowPlayingOpen && !showNowPlayingSlot) {
    setShowNowPlayingSlot(true);
  }

  const handleNowPlayingClosed = useCallback(
    () => setShowNowPlayingSlot(false),
    [],
  );

  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[auto_1fr_auto] h-screen max-w-screen overflow-hidden">
        {/* Header — desktop only, removed from flow entirely on mobile */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Now Playing takeover slot */}
        <div
          className={`w-full h-full md:my-1 max-md:mb-27 overflow-hidden ${
            showNowPlayingSlot ? "" : "hidden"
          }`}
        >
          <NowPlayingView
            isOpen={isNowPlayingOpen}
            onClosed={handleNowPlayingClosed}
          />
        </div>

        {/* Main row — flex-col on mobile, icon-rail grid on md, resizable flex on lg */}
        <div
          className={`flex-1 min-h-0 flex flex-col md:grid ${isAuthenticated ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-1"} lg:flex lg:flex-row md:gap-1 md:m-1 md:my-2 overflow-hidden ${
            showNowPlayingSlot ? "hidden!" : ""
          }`}
        >
          {/* Left sidebar: hidden on mobile, 80px icon rail on md, resizable on lg */}
          <div
            className={`hidden ${isAuthenticated ? "md:block" : "lg:block"} w-20 lg:w-(--left-w) h-full shrink-0 overflow-hidden`}
            style={{ "--left-w": `${leftWidth}px` } as React.CSSProperties}
          >
            <LeftSidebar />
          </div>

          {/* Resize handle: only meaningful (and visible) at lg+ */}
          <ResizeHandle onResize={adjustLeftWidth} />

          {/* Main content */}
          <main
            className={`flex-1 min-w-0 min-h-0 overflow-y-auto md:overflow-hidden ${
              currentSong ? "pb-60 md:pb-0" : "pb-40 md:pb-0"
            }`}
          >
            {children}
          </main>

          {/* Right sidebar: only ever exists at lg+, and only when relevant */}
          {isRightSidebarVisible && (
            <>
              <ResizeHandle onResize={adjustRightWidth} />
              <div
                className="hidden lg:block shrink-0 overflow-hidden"
                style={{ width: rightWidth }}
              >
                <Rightsidebar />
              </div>
            </>
          )}
        </div>

        {/* Bottom bar — fixed Player + BottomNav on mobile, in-flow Player only on desktop */}
        <div className={showNowPlayingSlot ? "hidden" : ""}>
          <div className="fixed bottom-16 left-0 right-0 z-40 md:static md:bottom-auto md:left-auto md:right-auto md:z-auto">
            <Player />
          </div>
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
      <RightSidebarPanelOverlay />
    </>
  );
};

export default LayoutContent;
