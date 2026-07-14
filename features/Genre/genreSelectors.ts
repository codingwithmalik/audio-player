import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { Song } from "@/types/song";

/** Distinct languages the user has actually listened to, derived from history. */
export const selectUserLanguages = createSelector(
  [
    (state: RootState) => state.history.recentSongIds,
    (state: RootState) => state.songs.entities,
  ],
  (recentSongIds, songsById) => {
    const languages = new Set<string>();
    for (const id of recentSongIds) {
      const lang = songsById[id]?.language;
      if (lang) languages.add(lang);
    }
    return languages;
  }
);

/**
 * Genre cards to show on /genre — restricted to genres that appear on songs
 * in the user's listened languages. Falls back to all genres for new users
 * with no history, same fallback pattern as "Made For You."
 */
export const selectPersonalizedGenres = createSelector(
  [selectUserLanguages, (state: RootState) => state.songs.entities],
  (userLanguages, songsById): string[] => {
    const useAll = userLanguages.size === 0;
    const genreSet = new Set<string>();

    for (const song of Object.values(songsById)) {
      if (!song.genres) continue;
      if (useAll || (song.language && userLanguages.has(song.language))) {
        for (const genre of song.genres) genreSet.add(genre);
      }
    }
    return Array.from(genreSet).sort();
  }
);

/** All languages present in the catalog — this section is the picker itself, unfiltered. */
export const selectAllLanguages = createSelector(
  [(state: RootState) => state.songs.entities],
  (songsById): string[] => {
    const langSet = new Set<string>();
    for (const song of Object.values(songsById)) {
      if (song.language) langSet.add(song.language);
    }
    return Array.from(langSet).sort();
  }
);

export const selectSongsByGenre = createSelector(
  [
    (state: RootState) => state.songs.entities,
    (_: RootState, genre: string) => genre,
  ],
  (songsById, genre): Song[] =>
    Object.values(songsById).filter((song) => song.genres?.includes(genre))
);

export const selectSongsByLanguage = createSelector(
  [
    (state: RootState) => state.songs.entities,
    (_: RootState, language: string) => language,
  ],
  (songsById, language): Song[] =>
    Object.values(songsById).filter((song) => song.language === language)
);