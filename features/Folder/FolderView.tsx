"use client";

import { useRef, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectFolderById,
  updateFolderMeta,
} from "@/features/Folder/folderSlice";
import { gsap } from "gsap";
import FolderHero from "./FolderHero";
import FolderActions from "./FolderActions";
import FolderPlaylistList from "./FolderPlaylistList";
import FolderViewSkeleton from "./Animations/FolderViewSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";
import type { RootState } from "@/store/store";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { closeRightSidebarPanel } from "@/slices/rightSidebarSlice";
import { useGetPlaylistsQuery } from "../Playlist/playlistsApi";
import { useGetFolderQuery, useRenameFolderMutation } from "./foldersApi";

export default function FolderView({ folderId }: { folderId: string }) {
  const [renameFolder] = useRenameFolderMutation();
  const dispatch = useAppDispatch();

  const {
    isLoading: folderLoading,
    isError: folderError,
    refetch: refetchFolder,
  } = useGetFolderQuery(folderId);
  const folder = useAppSelector((state: RootState) =>
    selectFolderById(state, folderId),
  );

  const {
    data: playlists = [],
    isLoading: playlistsLoading,
    isError: playlistsError,
    refetch: refetchPlaylists,
  } = useGetPlaylistsQuery({ folderId });

  const containerRef = useRef<HTMLDivElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  // ── GSAP entrance ─────────────────────────────────────────────────────────
  // Also depends on folderLoading, not just folderId — previously this only
  // ever ran while the skeleton was up (no [data-gsap] elements to find yet)
  // and never re-ran once real content actually mounted.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const hero = el.querySelector<HTMLElement>("[data-gsap='hero']");
    const actions = el.querySelector<HTMLElement>("[data-gsap='actions']");
    const rows = el.querySelectorAll<HTMLElement>("[data-gsap='playlist-row']");

    if (!hero || !actions) return;

    gsap.set([hero, actions], { opacity: 0, y: 24 });
    gsap.set(rows, { opacity: 0, x: -12 });

    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .to(hero, { opacity: 1, y: 0, duration: 0.45 })
      .to(actions, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2")
      .to(rows, { opacity: 1, x: 0, duration: 0.25, stagger: 0.03 }, "-=0.1")
      .call(() => {
        gsap.set([hero, actions, rows], { clearProps: "transform" });
      });
  }, [folderId, folderLoading]);

  useEffect(() => {
    return () => {
      dispatch(closeRightSidebarPanel());
    };
  }, [folderId, dispatch]);

  const handleRename = (newTitle: string) => {
    if (!newTitle.trim()) return;
    dispatch(updateFolderMeta({ id: folderId, title: newTitle.trim() }));
    renameFolder({ id: folderId, title: newTitle.trim() });
    setIsRenaming(false);
  };

  if (folderError) {
    return (
      <div className="h-full w-full glass rounded-md">
        <ErrorState
          message="Couldn't load this folder."
          onRetry={refetchFolder}
        />
      </div>
    );
  }

  // Loading and "genuinely missing" used to share the same !folder check —
  // split explicitly so a fresh page load doesn't flash "Folder not found."
  if (folderLoading) {
    return (
      <div className="h-full w-full glass rounded-md overflow-hidden">
        <FolderViewSkeleton />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm glass">
        Folder not found.
      </div>
    );
  }

  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="h-full w-full  glass rounded-md"
    >
      <div ref={containerRef} className="flex flex-col min-h-full pb-8">
        <div data-gsap="hero">
          <FolderHero
            folder={folder}
            isRenaming={isRenaming}
            onRenameStart={() => setIsRenaming(true)}
            onRenameConfirm={handleRename}
            onRenameCancel={() => setIsRenaming(false)}
          />
        </div>

        <div data-gsap="actions">
          <FolderActions
            folderId={folderId}
            onRename={() => setIsRenaming(true)}
          />
        </div>

        <FolderPlaylistList
          playlists={playlists}
          isLoading={playlistsLoading}
          isError={playlistsError}
          onRetry={refetchPlaylists}
        />
      </div>
    </OverlayScrollbarsComponent>
  );
}
