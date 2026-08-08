"use client";

import { useAppSelector } from "@/globalHooks";
import {
  selectPersonalizedGenres,
  selectAllLanguages,
} from "@/features/Genre/genreSelectors";
import { useGetSongsQuery } from "@/features/Songs/songsApi";
import BrowseCard from "./BrowseCard";
import BrowseCardSkeletonGrid from "./Animations/BrowseCardSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";

// This derives the genre/language picker from a bounded batch of songs
// client-side. Works fine at current catalog size, but it's a stopgap, not
// the real shape — a dedicated /api/genres-style facets endpoint returning
// distinct values directly is the actual fix once this needs to scale.
const FACET_SAMPLE_LIMIT = 300;

export default function BrowseGrid() {
  const { isLoading, isError, refetch } = useGetSongsQuery({
    limit: FACET_SAMPLE_LIMIT,
  });
  const genres = useAppSelector(selectPersonalizedGenres);
  const languages = useAppSelector(selectAllLanguages);

  if (isError) {
    return (
      <ErrorState
        message="Couldn't load genres and languages."
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section>
          <div className="mb-4 h-6 w-24 animate-pulse rounded bg-white/10" />
          <BrowseCardSkeletonGrid />
        </section>
        <section>
          <div className="mb-4 h-6 w-28 animate-pulse rounded bg-white/10" />
          <BrowseCardSkeletonGrid />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Genres</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {genres.map((genre) => (
            <BrowseCard key={genre} label={genre} type="genre" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Languages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {languages.map((language) => (
            <BrowseCard key={language} label={language} type="language" />
          ))}
        </div>
      </section>
    </div>
  );
}
