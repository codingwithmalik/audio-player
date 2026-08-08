export default function FolderPlaylistRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 px-3 py-3">
      <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/10" />
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="h-3 w-2/5 rounded bg-white/10" />
        <div className="h-2.5 w-1/4 rounded bg-white/5" />
      </div>
    </div>
  );
}