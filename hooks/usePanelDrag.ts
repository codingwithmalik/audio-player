"use client";

import { useRef, useCallback } from "react";

interface UsePanelDragOptions {
  onClose: () => void;
  disabled?: boolean;
  /** Fraction of panel height dragged before it counts as a close, default 0.3 */
  closeThreshold?: number;
  /** px/ms — a fast flick closes even under the distance threshold, default 0.5 */
  velocityThreshold?: number;
}

export function usePanelDrag(
  panelRef: React.RefObject<HTMLDivElement | null>,
  {
    onClose,
    disabled = false,
    closeThreshold = 0.3,
    velocityThreshold = 0.5,
  }: UsePanelDragOptions,
) {
  const startY = useRef(0);
  const startTime = useRef(0);
  const dragDistance = useRef(0);
  const dragging = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !panelRef.current) return;
      dragging.current = true;
      startY.current = e.clientY;
      dragDistance.current = 0;
      startTime.current = performance.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      panelRef.current.style.transition = "none";
    },
    [disabled, panelRef],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !panelRef.current) return;
      const delta = e.clientY - startY.current;
      dragDistance.current = Math.max(0, delta); // only downward drag
      panelRef.current.style.transform = `translateY(${dragDistance.current}px)`;
    },
    [panelRef],
  );

  const onPointerUp = useCallback(() => {
    if (!dragging.current || !panelRef.current) return;
    dragging.current = false;

    const panelHeight = panelRef.current.offsetHeight;
    const elapsed = Math.max(performance.now() - startTime.current, 1);
    const velocity = dragDistance.current / elapsed;

    panelRef.current.style.transition = "";
     panelRef.current.style.transform = ""; // always clear — let CSS classes drive it from here


    const shouldClose =
      dragDistance.current > panelHeight * closeThreshold ||
      velocity > velocityThreshold;

    if (shouldClose) {
      onClose();
    }
  }, [panelRef, onClose, closeThreshold, velocityThreshold]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };
}