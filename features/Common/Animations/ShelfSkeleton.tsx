import TileSkeleton from "./TileSkeleton";

export default function ShelfSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="mb-8">
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-white/10 px-1" />
      <div className="flex gap-4 overflow-hidden pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-40 shrink-0">
            <TileSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
