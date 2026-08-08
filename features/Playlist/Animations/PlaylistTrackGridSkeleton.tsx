function GridCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 animate-pulse">
      <div className="aspect-square rounded-lg bg-white/10" />
      <div className="h-3 w-4/5 rounded bg-white/10" />
      <div className="h-2.5 w-3/5 rounded bg-white/5" />
    </div>
  );
}

export default function PlaylistTrackGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => <GridCardSkeleton key={i} />)}
    </div>
  );
}