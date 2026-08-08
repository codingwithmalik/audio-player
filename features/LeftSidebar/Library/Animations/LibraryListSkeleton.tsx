import LibraryItemSkeleton from "./LibraryItemSkeleton";

export default function LibraryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1 mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <LibraryItemSkeleton key={i} />
      ))}
    </div>
  );
}
