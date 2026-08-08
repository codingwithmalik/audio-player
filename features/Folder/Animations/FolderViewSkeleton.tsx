import FolderHeroSkeleton from "./FolderHeroSkeleton";
import FolderPlaylistRowSkeleton from "./FolderPlaylistRowSkeleton";

export default function FolderViewSkeleton() {
  return (
    <div className="flex flex-col min-h-full pb-8">
      <FolderHeroSkeleton />
      <div className="flex items-center gap-3 px-4 sm:px-8 py-4">
        <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="h-9 w-36 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="flex flex-col px-2 sm:px-6 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <FolderPlaylistRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
