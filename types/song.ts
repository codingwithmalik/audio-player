export interface Song {
  id: string;

  title: string;

  artists: string[];

  coverImage?: string;

  audioUrl: string;

  duration: number;

  uploadedBy: string;

  createdAt: string;

  updatedAt: string;

  /** Always stored lowercase, e.g. "english", "hindi", "punjabi" */
  language?: string;

  /** Always stored lowercase, e.g. ["romantic", "sad"] */
  genres?: string[];
}
