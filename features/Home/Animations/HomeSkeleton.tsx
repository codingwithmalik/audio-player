import PlaylistShortcutTileSkeleton from "./PlaylistShortcutTileSkeleton";
import ShelfSkeleton from "@/features/Common/Animations/ShelfSkeleton";

export default function HomeSkeleton() {
  return (
    <div className="px-6 py-4">
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaylistShortcutTileSkeleton key={i} />
          ))}
        </div>
      </section>
      <ShelfSkeleton />
      <ShelfSkeleton />
      <ShelfSkeleton />
    </div>
  );
}
