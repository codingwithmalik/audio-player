"use client";

import { useRef, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectFolderById,
  updateFolderMeta,
} from "@/features/Folder/folderSlice";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import { gsap } from "gsap";
import FolderHero from "./FolderHero";
import FolderActions from "./FolderActions";
import FolderPlaylistList from "./FolderPlaylistList";
import type { RootState } from "@/store/store";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function FolderView({ folderId }: { folderId: string }) {
  const dispatch = useAppDispatch();
  const folder = useAppSelector((state: RootState) =>
    selectFolderById(state, folderId),
  );

  const playlists = useAppSelector((state: RootState) =>
    (folder?.playlistIds ?? [])
      .map((id) => selectPlaylistById(state, id))
      .filter(Boolean),
  ) as NonNullable<ReturnType<typeof selectPlaylistById>>[];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  // ── GSAP entrance ─────────────────────────────────────────────────────────
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
  }, [folderId]);

  const handleRename = (newTitle: string) => {
    if (!newTitle.trim()) return;
    dispatch(updateFolderMeta({ id: folderId, title: newTitle.trim() }));
    setIsRenaming(false);
  };

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

        <FolderPlaylistList playlists={playlists} />
      </div>
    </OverlayScrollbarsComponent>
  );
}
