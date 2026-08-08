export default function PlaylistTrackRowSkeleton() {
  return (
    <div className="grid items-center gap-4 px-4 py-2 animate-pulse sm:grid-cols-[32px_1.5fr_20px_1fr_48px_32px] grid-cols-[1.5fr_20px_32px]">
      <div className="hidden sm:block h-3 w-3 rounded bg-white/10 justify-self-center" />
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-11 w-11 shrink-0 rounded-md bg-white/10" />
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="h-3 w-2/5 rounded bg-white/10" />
          <div className="h-2.5 w-1/4 rounded bg-white/5" />
        </div>
      </div>
      <div />
      <div className="hidden sm:block h-3 w-16 rounded bg-white/5" />
      <div className="hidden sm:block h-3 w-8 rounded bg-white/5 justify-self-end" />
      <div />
    </div>
  );
}
