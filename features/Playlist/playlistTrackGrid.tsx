import PlaylistSongGridCard from "./playlistSongGridCard";
import { Song } from "@/types/song";

const PlaylistTrackGrid = ({
  filteredSongs,
  onPlaySong,
  currentSongId,
  isPlaylistPlaying,
  isCurrentPlaylist,
}: {
  filteredSongs: Song[];
  onPlaySong: (songId: string, index: number) => void;
  currentSongId: string | null;
  isPlaylistPlaying: boolean;
  isCurrentPlaylist: boolean;
}) => {
  return (
    <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {filteredSongs.map((song, i) => (
        <div key={song.id} data-gsap="track-row">
          <PlaylistSongGridCard
            song={song}
            isPlaying={isPlaylistPlaying && song.id === currentSongId}
            isCurrent={isCurrentPlaylist && song.id === currentSongId}
            onPlaySong={() => onPlaySong(song.id, i)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlaylistTrackGrid;
