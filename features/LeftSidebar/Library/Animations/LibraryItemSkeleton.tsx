export default function LibraryItemSkeleton() {
  return (
    <div className="flex items-center gap-3 lg:p-1 pl-0 py-1 animate-pulse">
      <div className="w-14 h-14 shrink-0 rounded-md bg-white/10" />
      <div className="md:hidden lg:block flex-1 min-w-0 space-y-2">
        <div className="h-3 w-3/5 rounded bg-white/10" />
        <div className="h-2.5 w-2/5 rounded bg-white/5" />
      </div>
    </div>
  );
}