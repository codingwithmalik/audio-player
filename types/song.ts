export interface Song {
  id: string;

  title: string;

  artists: string[];

  coverImage?: string;

  audioUrl: string;

  duration: number;
  
  uploadedBy: string;

  createdAt: string;
  //added the updated at myself can remove it later if does any mishap
  updatedAt: string;
}


// plays: number;

// likes: number;
    