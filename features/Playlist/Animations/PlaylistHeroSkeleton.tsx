export default function PlaylistHeroSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Mobile */}
      <div className="block sm:hidden">
        <div className="flex justify-center pt-8 mx-10">
          <div className="w-[90%] aspect-square rounded-md bg-white/10" />
        </div>
        <div className="flex flex-col gap-3 px-4 pt-4 pb-2 items-center">
          <div className="h-8 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/5" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-end gap-6 p-6">
        <div className="w-54 h-54 shrink-0 rounded-lg bg-white/10" />
        <div className="flex flex-col gap-3 flex-1 min-w-0 pb-2">
          <div className="h-14 w-3/4 max-w-md rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/5" />
          <div className="h-3 w-1/4 rounded bg-white/5 mt-1" />
        </div>
      </div>
    </div>
  );
}
