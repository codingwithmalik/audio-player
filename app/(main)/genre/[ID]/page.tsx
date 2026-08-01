"use client";

import { Suspense } from "react";
import GenreDetailContent from "@/features/Genre/GenreDetailContent";

export default function GenreDetailPage() {
  return (
    <Suspense fallback={null}>
      <GenreDetailContent />
    </Suspense>
  );
}
