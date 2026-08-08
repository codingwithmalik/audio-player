export default function FolderHeroSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 px-4 sm:px-8 pt-10 pb-8 animate-pulse">
      <div className="shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white/5 border border-white/10" />
      <div className="flex flex-col gap-3 w-full max-w-md items-center sm:items-start">
        <div className="h-3 w-14 rounded bg-white/10" />
        <div className="h-10 sm:h-14 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-24 rounded bg-white/5" />
      </div>
    </div>
  );
}