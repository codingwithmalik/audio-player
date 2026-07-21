"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  selectCurrentSongId,
  selectIsShuffle,
  selectRepeatMode,
  setRepeatMode,
  toggleShuffle,
} from "@/store/playerSlice";
import {
  shuffleQueue,
  unshuffleQueue,
} from "@/features/RightSidebar/Queue/queueSlice";
import {
  selectRightSidebarPanel,
  openQueue,
  closeRightSidebarPanel,
} from "@/slices/rightSidebarSlice";
import {
  desktopSearchInputRef,
  mobileSearchInputRef,
} from "@/features/Search/searchInputRef";

const REPEAT_CYCLE = ["off", "all", "one"] as const;

export default function useGlobalKeyboardShortcuts() {
  const dispatch = useAppDispatch();
  const repeatMode = useAppSelector(selectRepeatMode);
  const isShuffled = useAppSelector(selectIsShuffle);
  const currentSongId = useAppSelector(selectCurrentSongId) ?? null;
  const rightSidebarPanel = useAppSelector(selectRightSidebarPanel);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.visibilityState !== "visible") return;

      const isModK = (e.metaKey || e.ctrlKey) && e.code === "KeyK";

      // Ctrl/Cmd+K should work even while typing elsewhere — everything
      // else respects the input guard.
      const target = e.target as HTMLElement | null;
      const isTypingContext =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTypingContext && !isModK) return;

      switch (true) {
        case isModK: {
          e.preventDefault();
          const isMobileViewport = window.innerWidth < 768; // same breakpoint as useIsMobile(768)
          const target = isMobileViewport
            ? mobileSearchInputRef
            : desktopSearchInputRef;
          target.current?.focus();
          break;
        }
        case e.code === "KeyS" && !e.ctrlKey && !e.metaKey && !e.altKey: {
          e.preventDefault();
          dispatch(
            isShuffled ? unshuffleQueue({ currentSongId }) : shuffleQueue(),
          );
          dispatch(toggleShuffle())
          break;
        }

        case e.code === "KeyR" && !e.ctrlKey && !e.metaKey && !e.altKey: {
          e.preventDefault();
          const currentIdx = REPEAT_CYCLE.indexOf(repeatMode);
          const nextMode = REPEAT_CYCLE[(currentIdx + 1) % REPEAT_CYCLE.length];
          dispatch(setRepeatMode(nextMode));
          break;
        }

        case e.code === "KeyQ": {
          e.preventDefault();
          if (rightSidebarPanel?.tab === "queue") {
            dispatch(closeRightSidebarPanel());
          } else {
            dispatch(openQueue());
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, repeatMode, isShuffled, rightSidebarPanel, currentSongId]);
}
