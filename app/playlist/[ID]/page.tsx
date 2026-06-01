"use client";
import React from "react";
import { useParams } from "next/navigation";
const Playlist = () => {
  const { ID } = useParams<{ ID: string }>();
  return <div>This is playlist id: {ID} </div>;
};

export default Playlist;

// D:\Coding\audio-player\app\playlist\[slug]\playlist.tsx
