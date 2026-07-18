"use client";

import { useState } from "react";
import LibraryItem from "./libraryItem";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { selectFilteredItems } from "./libraryslice";
import { setPlaylistFolder } from "@/features/Playlist/playlistSlice";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useIsMobile } from "@/hooks/useIsMobile";
import { selectLibrarySettings } from "@/features/Profile/settingsSlice";
import LocalFilesLibraryRow from "../LocalFiles/LocalFilesLibraryRow";

export default function LibraryList({
  ShowLocalFiles,
}: {
  ShowLocalFiles: () => void;
}) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFilteredItems);
  const allPlaylists = useAppSelector((state) => state.playlists.entities);
  const { showDownloadedSongs } = useAppSelector(selectLibrarySettings);
  const isMobile = useIsMobile();

  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const showLocalFilesRow = showDownloadedSongs && !isMobile;

  const rootItems = items.filter(
    (item) => item.type === "folder" || item.folderId === null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
  );

  function toggleExpand(folderId: string) {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const playlistId = active.id as string;
    const dropTargetId = over.id as string;
    if (playlistId === dropTargetId) return;

    const newFolderId = dropTargetId === "root" ? null : dropTargetId;
    dispatch(setPlaylistFolder({ playlistId, folderId: newFolderId }));
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <RootDropZone isAnyDragActive={activeId !== null}>
        {showLocalFilesRow && <LocalFilesLibraryRow onClick={ShowLocalFiles} />}

        {rootItems.length === 0 ? (
          <div className="mt-3 px-2 text-sm text-zinc-500 text-center">
            No playlists or folders yet
          </div>
        ) : (
          rootItems.map((item) => {
            const isFolder = item.type === "folder";
            const isExpanded = isFolder && expandedFolderIds.has(item.id);

            return (
              <div key={item.id}>
                <LibraryItem
                  item={item as Folder | Playlist}
                  isAnyDragActive={activeId !== null}
                  isExpanded={isExpanded}
                  onToggleExpand={
                    isFolder ? () => toggleExpand(item.id) : undefined
                  }
                />
                {isExpanded && (
                  <div className="flex flex-col gap-1">
                    {(item as Folder).playlistIds.map((playlistId) => {
                      const nestedPlaylist = allPlaylists[playlistId];
                      if (!nestedPlaylist) return null;
                      return (
                        <LibraryItem
                          key={nestedPlaylist.id}
                          item={nestedPlaylist}
                          depth={1}
                          isAnyDragActive={activeId !== null}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </RootDropZone>
    </DndContext>
  );
}

// The whole list is a drop target representing "no folder" — dropping a
// playlist here (outside any folder row) files it back to the root.
function RootDropZone({
  children,
  isAnyDragActive,
}: {
  children: React.ReactNode;
  isAnyDragActive: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "root" });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-1 mt-5 min-h-full rounded-lg transition-colors ${
        isAnyDragActive && isOver ? "bg-white/5" : ""
      }`}
    >
      {children}
    </div>
  );
}
