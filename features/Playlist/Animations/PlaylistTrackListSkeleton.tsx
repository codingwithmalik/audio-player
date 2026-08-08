import PlaylistTrackRowSkeleton from "./PlaylistTrackRowSkeleton";

export default function PlaylistTrackListSkeleton({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="w-full px-2">
      <div className="flex flex-col gap-0.5 mt-1">
        {Array.from({ length: count }).map((_, i) => (
          <PlaylistTrackRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
