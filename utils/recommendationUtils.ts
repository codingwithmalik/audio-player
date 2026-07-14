import type { Song } from "@/types/song";

interface HistoryEntry {
  songId: string;
  // ...other fields your historySlice entries have (timestamp, etc.) — unused here
}

/**
 * Tallies genre frequency across history and returns genres ranked by play count.
 * Genres are expected to already be lowercase (per Song type convention).
 */
export function getTopGenresFromHistory(
  historyEntries: HistoryEntry[],
  songsById: Record<string, Song>,
  limit: number,
): string[] {
  const genreCounts: Record<string, number> = {};

  for (const entry of historyEntries) {
    const song = songsById[entry.songId];
    if (!song?.genres) continue;

    for (const genre of song.genres) {
      genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
    }
  }

  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}

/**
 * Returns songs matching any of the given genres, excluding specified ids,
 * ranked by how many of the top genres they match (weighted by genre rank).
 */
export function getRecommendedSongs(
  songsById: Record<string, Song>,
  topGenres: string[],
  excludeIds: Set<string>,
  limit: number,
): Song[] {
  if (topGenres.length === 0) return [];

  const genreRank = new Map(
    topGenres.map((genre, index) => [genre, topGenres.length - index]),
  );

  const scored = Object.values(songsById)
    .filter((song) => !excludeIds.has(song.id))
    .map((song) => {
      const score = (song.genres ?? []).reduce(
        (sum, genre) => sum + (genreRank.get(genre) ?? 0),
        0,
      );
      return { song, score };
    })
    .filter(({ score }) => score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ song }) => song);
}

/**
 * Fallback for users with no history: globally most-played songs.
 */
export function getPopularSongs(
  songsById: Record<string, Song>,
  excludeIds: Set<string>,
  limit: number,
): Song[] {
  return Object.values(songsById)
    .filter((song) => !excludeIds.has(song.id))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit);
}
