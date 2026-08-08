export default function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-3 rounded-lg px-3 py-2"
        >
          <div className="h-11 w-11 shrink-0 rounded-md bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 rounded bg-white/10" />
            <div className="h-2.5 w-1/4 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
