import { connectDB } from "@/lib/db/connect";
import PlayEvent from "@/schemas/PlayEvent";
import Song from "@/schemas/Song";

export const recommendationService = {
  async getTrending(
    limit: number,
    skip: number,
    extraExcludeIds: string[] = [],
  ) {
    await connectDB();
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // rolling 7-day window

    const results = await PlayEvent.aggregate([
      { $match: { playedAt: { $gte: since } } },
      { $group: { _id: "$songId", playCount: { $sum: 1 } } },
      { $match: { _id: { $nin: extraExcludeIds } } },
      { $sort: { playCount: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const songIds = results.map((r) => r._id);
    const songs = await Song.find({ _id: { $in: songIds } });
    const byId = new Map(songs.map((s) => [s.id, s.toJSON()]));
    return songIds.map((id) => byId.get(id)).filter(Boolean);
  },

  async getMadeForYou(
    userId: string,
    limit: number,
    recentSongIds: string[],
    extraExcludeIds: string[] = [],
  ) {
    await connectDB();

    const excludeSet = [...new Set([...recentSongIds, ...extraExcludeIds])];
    const recentSongs = await Song.find({ _id: { $in: recentSongIds } });
    const genreCounts: Record<string, number> = {};
    const artistCounts: Record<string, number> = {};
    for (const song of recentSongs) {
      for (const genre of song.genres ?? []) {
        genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
      }
      for (const artist of song.artists ?? []) {
        artistCounts[artist] = (artistCounts[artist] ?? 0) + 1;
      }
    }
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([g]) => g);

    const topArtists = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([a]) => a);

    if (topGenres.length === 0 && topArtists.length === 0)
      return this.getPopular(limit, recentSongIds);

    const candidates = await Song.find({
      $or: [
        ...(topGenres.length ? [{ genres: { $in: topGenres } }] : []),
        ...(topArtists.length ? [{ artists: { $in: topArtists } }] : []),
      ],
      _id: { $nin: excludeSet },
    }).limit(limit * 4); // wider pool than needed, so scoring has room to actually differentiate

    // Score each candidate: artist match weighted higher than genre match —
    // hearing the same artist again is a stronger signal than merely sharing a genre.
    const genreRank = new Map(
      topGenres.map((g, i) => [g, topGenres.length - i]),
    );
    const artistRank = new Map(
      topArtists.map((a, i) => [a, topArtists.length - i]),
    );

    const scored = candidates.map((song) => {
      const genreScore = (song.genres ?? []).reduce(
        (sum: number, g: string) => sum + (genreRank.get(g) ?? 0),
        0,
      );
      const artistScore = (song.artists ?? []).reduce(
        (sum: number, a: string) => sum + (artistRank.get(a) ?? 0), // artist match weighted 2x
        0,
      );
      return { song, score: genreScore + artistScore };
    });
    scored.sort(
      (a, b) => b.score - a.score || b.song.playCount - a.song.playCount,
    );

    return scored.slice(0, limit).map(({ song }) => song);
  },

  async getPopular(limit: number, recentSongIds: string[]) {
    await connectDB();
    return Song.find({ _id: { $nin: recentSongIds } })
      .sort({ playCount: -1 })
      .limit(limit);
  },
};
