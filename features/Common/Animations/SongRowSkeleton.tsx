export default function SongRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="h-12 w-12 shrink-0 rounded-lg bg-white/10 sm:h-14 sm:w-14" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3.5 w-2/5 rounded bg-white/10" />
        <div className="h-3 w-1/3 rounded bg-white/10" />
      </div>
      <div className="hidden shrink-0 gap-1.5 sm:flex">
        <div className="h-9 w-9 rounded-full bg-white/10" />
        <div className="h-9 w-9 rounded-full bg-white/10" />
        <div className="h-9 w-9 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
