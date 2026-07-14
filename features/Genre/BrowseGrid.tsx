"use client";

import { useAppSelector } from "@/globalHooks";
import { selectPersonalizedGenres, selectAllLanguages } from "@/features/Genre/genreSelectors";
import BrowseCard from "./BrowseCard";

export default function BrowseGrid() {
  const genres = useAppSelector(selectPersonalizedGenres);
  const languages = useAppSelector(selectAllLanguages);

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