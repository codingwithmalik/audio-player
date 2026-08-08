export default function SubmenuRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col py-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 px-4 py-2.5">
          <div className="h-8 w-8 shrink-0 rounded-md bg-white/10" />
          <div className="h-3 w-2/5 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}