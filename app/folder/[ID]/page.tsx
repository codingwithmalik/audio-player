"use client"
import React from 'react'
import { useParams } from 'next/navigation';
const FolderID = () => {
  const { ID } = useParams<{ ID: string }>();
  return (
    <div>Folder ID: {ID}</div>
  )
}

export default FolderID