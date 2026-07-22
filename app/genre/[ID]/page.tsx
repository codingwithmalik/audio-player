"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectSongsByGenre,
  selectSongsByLanguage,
} from "@/features/Genre/genreSelectors";
import {
  setQueue,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { setSong } from "@/slices/playerSlice";
import ShelfTile from "@/features/Home/ShelfTile";
import type { RootState } from "@/store/store";
import type { ShelfItem } from "@/features/Home/ShelfRow";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function GenreDetailPage() {
  const params = useParams<{ ID: string }>();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const value = decodeURIComponent(params.ID);
  const type = searchParams.get("type") === "language" ? "language" : "genre";

  const songs = useAppSelector((s: RootState) =>
    type === "genre"
      ? selectSongsByGenre(s, value)
      : selectSongsByLanguage(s, value),
  );

  const handleSongClick = (allIds: string[], clickedId: string) => {
    const reordered = [clickedId, ...allIds.filter((id) => id !== clickedId)];
    dispatch(
      setQueue({ songIds: reordered, sourceType: "home", sourceId: null }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(clickedId));
  };

  const allIds = songs.map((s) => s.id);
  const items: ShelfItem[] = songs.map((song) => ({
    kind: "song" as const,
    id: song.id,
    title: song.title,
    subtitle: song.artists[0],
    coverImage: song.coverImage,
    onClick: () => handleSongClick(allIds, song.id),
  }));

  const display = value.charAt(0).toUpperCase() + value.slice(1);

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
        <h1 className="text-2xl font-bold text-white mb-6">{display}</h1>
        {items.length === 0 ? (
          <p className="text-zinc-400 text-sm">No songs found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <ShelfTile key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </OverlayScrollbarsComponent>
  );
}
