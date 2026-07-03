"use client";
import React from "react";
import { useParams } from "next/navigation";
import FolderView from "@/features/Folder/FolderView";
const FolderID = () => {
  const { ID } = useParams<{ ID: string }>();
  return <FolderView folderId={ID} />;
};

export default FolderID;
