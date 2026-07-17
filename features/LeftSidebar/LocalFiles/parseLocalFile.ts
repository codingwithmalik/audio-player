import { parseBlob } from "music-metadata";
import type { Song } from "@/types/song";

/**
 * Parses one local audio File into a Song object.
 * Tries real ID3/Vorbis tags first; falls back to filename-as-title
 * and a measured <audio> duration if tags don't have one.
 */
export async function parseLocalFile(
  file: File,
  uploadedBy: string,
): Promise<Song> {
  const audioUrl = URL.createObjectURL(file);
  const now = new Date().toISOString();

  let title = stripExtension(file.name);
  let artists: string[] = ["Unknown Artist"];
  let duration = 0;
  let coverImage: string | undefined;

  try {
    const metadata = await parseBlob(file);
    const { common, format } = metadata;

    if (common.title) title = common.title;
    if (common.artists?.length) artists = common.artists;
    else if (common.artist) artists = [common.artist];
    if (format.duration) duration = Math.round(format.duration);

    const picture = common.picture?.[0];
    if (picture) {
      const blob = new Blob([new Uint8Array(picture.data)], {
        type: picture.format,
      });
      coverImage = URL.createObjectURL(blob);
    }
  } catch {
    // No readable tags on this file — filename/duration fallbacks below cover it,
    // this isn't a real error state worth surfacing to the user.
  }

  if (!duration) {
    duration = await measureDuration(audioUrl);
  }

  return {
    id: crypto.randomUUID(),
    title,
    artists,
    coverImage,
    audioUrl,
    duration,
    uploadedBy,
    createdAt: now,
    updatedAt: now,
    playCount: 0,
  };
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

function measureDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      resolve(Math.round(audio.duration) || 0);
    });
    audio.addEventListener("error", () => resolve(0));
  });
}
