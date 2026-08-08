"use client";

import { useMemo, useState } from "react";
import LibraryItem from "./libraryItem";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectFilteredItems,
  selectFilters,
  selectSearch,
} from "./libraryslice";
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
import { useRouter } from "next/navigation";
import {
  useGetPlaylistsQuery,
  useMovePlaylistMutation,
} from "@/features/Playlist/playlistsApi";
import { useGetFoldersQuery } from "@/features/Folder/foldersApi";
import LibraryListSkeleton from "./Animations/LibraryListSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";

export default function LibraryList({
  ShowLocalFiles,
}: {
  ShowLocalFiles: () => void;
}) {
  const {
    isLoading: playlistsLoading,
    isError: playlistsError,
    refetch: refetchPlaylists,
  } = useGetPlaylistsQuery();
  const {
    isLoading: foldersLoading,
    isError: foldersError,
    refetch: refetchFolders,
  } = useGetFoldersQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFilteredItems);

  const allPlaylists = useAppSelector((state) => state.playlists.entities);
  // after allPlaylists is read, before the return:
  const playlistsByFolderId = useMemo(() => {
    const grouped: Record<string, Playlist[]> = {};
    for (const playlist of Object.values(allPlaylists)) {
      if (!playlist.folderId) continue;
      (grouped[playlist.folderId] ??= []).push({
        ...playlist,
        type: "playlist" as const,
      });
    }
    return grouped;
  }, [allPlaylists]);
  const filters = useAppSelector(selectFilters);
  const search = useAppSelector(selectSearch);
  const [movePlaylist] = useMovePlaylistMutation();

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
  const isDesktop = !useIsMobile(1024);
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
    movePlaylist({ id: playlistId, folderId: newFolderId });
  }

  function handleDragCancel() {
    setActiveId(null);
  }
  const handleshowFiles = () => {
    router.push("/Storage");
  };

  if (playlistsError || foldersError) {
    return (
      <div className="mt-5">
        <ErrorState
          message="Couldn't load your library."
          onRetry={() => {
            refetchPlaylists();
            refetchFolders();
          }}
          compact
        />
      </div>
    );
  }

  if (playlistsLoading || foldersLoading) {
    return <LibraryListSkeleton />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <RootDropZone isAnyDragActive={activeId !== null}>
        {showLocalFilesRow && (
          <LocalFilesLibraryRow
            onClick={isDesktop ? ShowLocalFiles : handleshowFiles}
          />
        )}
        <>
          {rootItems.length === 0 &&
            filters.length === 0 &&
            search.length === 0 && (
              <div className="mt-3 px-2 text-sm text-zinc-500 text-center">
                No playlists or folders yet
              </div>
            )}

          {rootItems.length === 0 && filters.length > 0 && (
            <div className="mt-3 px-2 text-sm text-zinc-500 text-center">
              No matches for selected filters
            </div>
          )}

          {rootItems.length === 0 && search.length > 0 && (
            <div className="mt-3 px-2 text-sm text-zinc-500 text-center">
              No results found for {search}
            </div>
          )}
          {rootItems.length > 0 &&
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
                      {(playlistsByFolderId[item.id] ?? []).map(
                        (nestedPlaylist) => {
                          return (
                            <LibraryItem
                              key={nestedPlaylist.id}
                              item={nestedPlaylist}
                              depth={1}
                              isAnyDragActive={activeId !== null}
                            />
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </>
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
  const isMobile = useIsMobile();
  const { setNodeRef, isOver } = useDroppable({
    id: "root",
    disabled: isMobile,
  });

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
