export default function PlaylistActionsSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 sm:px-6 py-4 animate-pulse">
      <div className="h-14 w-14 rounded-full bg-white/10" />
      <div className="h-7 w-7 rounded-full bg-white/5" />
      <div className="h-7 w-7 rounded-full bg-white/5" />
      <div className="ml-auto h-7 w-7 rounded-full bg-white/5" />
    </div>
  );
}