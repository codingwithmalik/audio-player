// app/playlist/[ID]/page.tsx
"use client";
import PlaylistCard from "@/features/Playlist/playlistCard";
import { useParams } from "next/navigation";

export default function Page() {
  const { ID } = useParams<{ ID: string }>();
  const params = useParams();
  console.log(params);
  console.log("ID found: " + ID);
  return <PlaylistCard id={ID} />;
}
