export default function BrowseCardSkeletonGrid({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-white/10" />
      ))}
    </div>
  );
}
