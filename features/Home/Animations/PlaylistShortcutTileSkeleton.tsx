export default function PlaylistShortcutTileSkeleton() {
  return (
    <div className="flex w-full animate-pulse items-center gap-2 rounded-md bg-white/5 sm:gap-3">
      <div className="h-11 w-11 shrink-0 rounded-md bg-white/10 sm:h-14 sm:w-14" />
      <div className="mr-12 h-3 flex-1 rounded bg-white/10" />
    </div>
  );
}