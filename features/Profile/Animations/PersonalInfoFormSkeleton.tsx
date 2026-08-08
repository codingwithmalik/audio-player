export default function PersonalInfoFormSkeleton() {
  return (
    <div className="flex gap-8 flex-wrap animate-pulse">
      <div className="flex flex-col items-center gap-3 shrink-0">
        <div className="w-32 h-32 rounded-full bg-white/10" />
        <div className="h-3 w-20 rounded bg-white/5" />
      </div>
      <div className="flex flex-col gap-6 flex-1 min-w-70 max-w-md">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-10 rounded-lg bg-white/5" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-16 rounded bg-white/10" />
          <div className="h-10 rounded-lg bg-white/5" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="flex gap-2">
            <div className="w-16 h-10 rounded-lg bg-white/5" />
            <div className="flex-1 h-10 rounded-lg bg-white/5" />
            <div className="w-20 h-10 rounded-lg bg-white/5" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-10 rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  );
}
