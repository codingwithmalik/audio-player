"use client";

import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { FolderClosed } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/globalHooks";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import { selectSongsByIds } from "@/features/Songs/songsSlice";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";

type Props = {
  item: Folder | Playlist;
};

export default function LibraryItem({ item }: Props) {
  const isFolder = item.type === "folder";

  const isPlaylist = item.type === "playlist";
  // console.log(isPlaylist)
  const id = isPlaylist ? item.id : "";
  // console.log(id);
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));
  // console.log(playlist);
  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  // console.log(songIds);
  const songs = useAppSelector((s) => selectSongsByIds(s, songIds));
  // console.log(songs);
  const songCovers = songs.slice(0, 4).map((s) => s.coverImage);
  // console.log(songCovers);
  const songCoversStrings = songCovers.filter((c): c is string => Boolean(c));
  // console.log(songCoversStrings);

  return (
    <Link href={`${isFolder ? `/folder/${item.id}` : `/playlist/${item.id}`}`}>
      <div className="group flex items-center gap-3 rounded-xl lg:p-1 pl-0 py-1 hover:bg-white/10 transition cursor-pointer">
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          {/* Icon is always rendered as the base — instantly visible */}
          <div className="flex items-center justify-center transition-opacity duration-200 overflow-hidden">
            {isFolder ? (
              <FolderClosed className="w-12 h-12" />
            ) : (
              <div className=" w-14 h-14 aspect-square">
              <PlaylistMosaicCover
                songCovers={songCoversStrings}
                title={isPlaylist ? item.title : ""}
                coverImage={item.coverImage}
              />
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden lg:block">
          <h3 className="text-white font-medium">{item.title}</h3>
          <p className="text-sm text-zinc-400">
            {isFolder
              ? `Folder • ${item.playlistIds.length} playlists`
              : `Playlist • ${item.songs.length} songs`}
          </p>
        </div>
      </div>
    </Link>
  );
}
