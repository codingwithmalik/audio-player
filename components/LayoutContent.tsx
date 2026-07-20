"use client";
import React, { useState, useCallback } from "react";
import Header from "../components/header";
import Player from "@/features/Player/player";
import Rightsidebar from "@/components/rightsidebar";
import LeftSidebar from "@/components/leftsidebar";
import BottomNav from "@/components/mobileNavbar";
import NowPlayingView from "@/features/Player/NowPlayingView";
import { selectCurrentSong, selectIsNowPlayingOpen } from "@/store/playerSlice";
import { useAppSelector } from "@/globalHooks";
import { useIsMobile } from "@/hooks/useIsMobile";
import RightSidebarPanelOverlay from "@/features/RightSidebar/RightSidebarPanelOverlay";
import { usePanelWidths } from "@/hooks/usePanelWidths";
import ResizeHandle from "@/features/Common/ResizeHandle";
import { selectRightSidebarPanel } from "@/slices/rightSidebarSlice";

const LayoutContent = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const isNowPlayingOpen = useAppSelector(selectIsNowPlayingOpen);
  const isMobileLayout = useIsMobile(768);
  const currentSong = useAppSelector(selectCurrentSong);

  // Updates :
  const isWideLayout = !useIsMobile(1024); // matches your existing lg: breakpoint
  const rightPanel = useAppSelector(selectRightSidebarPanel);
  const { leftWidth, rightWidth, adjustLeftWidth, adjustRightWidth } =
    usePanelWidths();

  // Right sidebar hides only when: wide layout, AND on the default tab,
  // AND nothing is currently playing. Any other tab (queue/addToPlaylist/
  // addToFolder) stays visible regardless of playback state.
  const isRightSidebarVisible =
    isWideLayout && (rightPanel.tab !== "default" || !!currentSong);

  const [showNowPlayingSlot, setShowNowPlayingSlot] =
    useState(isNowPlayingOpen);

  if (isNowPlayingOpen && !showNowPlayingSlot) {
    setShowNowPlayingSlot(true);
  }

  const handleNowPlayingClosed = useCallback(
    () => setShowNowPlayingSlot(false),
    [],
  );

  if (isMobileLayout) {
    return (
      <>
        <div className={`flex flex-col h-screen  `}>
          <div
            className={`w-full h-full my-1 max-md:mb-27 overflow-hidden ${
              showNowPlayingSlot ? "" : "hidden"
            }`}
          >
            <NowPlayingView
              isOpen={isNowPlayingOpen}
              onClosed={handleNowPlayingClosed}
            />
          </div>
          <main
            className={`flex-1 overflow-y-auto ${
              showNowPlayingSlot ? "hidden" : ""
            }${currentSong ? "pb-60" : "pb-40 "}`}
          >
            {children}
          </main>
          <div className={`${showNowPlayingSlot ? "hidden" : ""}`}>
            <div className="fixed  bottom-16 left-0 right-0 z-40">
              <Player />
            </div>
            <BottomNav />
          </div>
        </div>
        <RightSidebarPanelOverlay />
      </>
    );
  }

  return (
    <>
      <div className="grid h-screen grid-rows-[auto_1fr_auto] max-w-screen">
        <Header />
        <div
          className={`w-full h-full my-1 overflow-hidden ${
            showNowPlayingSlot ? "" : "hidden"
          }`}
        >
          <NowPlayingView
            isOpen={isNowPlayingOpen}
            onClosed={handleNowPlayingClosed}
          />
        </div>

        {isWideLayout ? (
          // ── lg+ : resizable flex row ──
          <div
            className={`flex gap-1 m-1 my-2 overflow-hidden ${
              showNowPlayingSlot ? "hidden" : ""
            }`}
          >
            <div
              style={{ width: leftWidth }}
              className="shrink-0 h-full overflow-hidden"
            >
              <LeftSidebar />
            </div>

            <ResizeHandle onResize={adjustLeftWidth} />

            <div className="flex-1 min-w-0 overflow-hidden">{children}</div>

            {isRightSidebarVisible && (
              <>
                <ResizeHandle onResize={adjustRightWidth} />
                <div
                  style={{ width: rightWidth }}
                  className="shrink-0 overflow-hidden"
                >
                  <Rightsidebar />
                </div>
              </>
            )}
          </div>
        ) : (
          // ── below lg : original icon-rail grid, unchanged ──
          <div
            className={`grid gap-1 m-1 my-2 overflow-hidden grid-cols-[80px_6fr] layout-grid ${
              showNowPlayingSlot ? "hidden" : ""
            }`}
          >
            <LeftSidebar />
            <div className="overflow-hidden min-w-0">{children}</div>
          </div>
        )}

        <Player />
      </div>
      <RightSidebarPanelOverlay />
    </>
  );
};

export default LayoutContent;
