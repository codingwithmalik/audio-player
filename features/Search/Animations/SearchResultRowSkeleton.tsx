export default function SearchResultRowSkeleton() {
  return (
    <div className="flex w-full animate-pulse items-center gap-3 rounded-md p-2 pr-3">
      <div className="h-12 w-12 shrink-0 rounded-md bg-white/10" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 w-2/5 rounded bg-white/10" />
        <div className="h-2.5 w-1/3 rounded bg-white/5" />
      </div>
    </div>
  );
}
