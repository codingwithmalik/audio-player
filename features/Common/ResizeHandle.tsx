"use client";
import { useCallback, useRef } from "react";

export default function ResizeHandle({
  onResize,
}: {
  onResize: (deltaX: number) => void;
}) {
  const lastXRef = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastXRef.current = e.clientX;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return; // only while actually pressed
      const deltaX = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      onResize(deltaX);
    },
    [onResize],
  );

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className="group relative w-2 shrink-0 cursor-col-resize touch-none hidden lg:block "
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 rounded-full bg-transparent group-hover:bg-purple-600/50 transition-colors" />
    </div>
  );
}
