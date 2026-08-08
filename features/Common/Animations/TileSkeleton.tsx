export default function TileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 p-2">
      <div className="aspect-square w-full rounded-md bg-white/10" />
      <div className="h-3 w-4/5 rounded bg-white/10" />
      <div className="h-2.5 w-3/5 rounded bg-white/5" />
    </div>
  );
}
