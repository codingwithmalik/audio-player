export default function RecentlyPlayedRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 animate-pulse">
      <div className="w-11 h-11 shrink-0 rounded-md bg-white/10" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 w-2/5 rounded bg-white/10" />
        <div className="h-2.5 w-1/4 rounded bg-white/5" />
      </div>
    </div>
  );
}
