/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePanelDrag } from "@/hooks/usePanelDrag";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PanelSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onClosed?: () => void;
  children: ReactNode;
  /** "overlay" = slide-up takeover (< lg). "inline" = plain render, no animation/drag (lg+). */
  mode?: "overlay" | "inline";
  className?: string;
  showDragHandle?: boolean;
}

const EXIT_DURATION_MS = 400;

export default function PanelSheet({
  isOpen,
  onClose,
  onClosed,
  children,
  mode = "overlay",
  className = "",
  showDragHandle = true,
}: PanelSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isNotDesktop = useIsMobile(1024);
  // Keeps last content rendered through the exit transition (overlay mode only).
  const [renderedChildren, setRenderedChildren] = useState<ReactNode>(children);
  useEffect(() => {
    if (isOpen) setRenderedChildren(children);
  }, [isOpen, children]);

  const [mounted, setMounted] = useState(false);
  const onClosedRef = useRef(onClosed);
  useEffect(() => {
    onClosedRef.current = onClosed;
  }, [onClosed]);

  useEffect(() => {
    if (mode !== "overlay") return;
    if (isOpen) {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }
    setMounted(false);
    const timeout = setTimeout(() => onClosedRef.current?.(), EXIT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [isOpen, mode]);

  const dragHandlers = usePanelDrag(panelRef, {
    onClose,
    disabled: mode !== "overlay",
  });

  if (mode === "inline") {
    if (!isOpen) return null;
    return (
      <div className={`h-full w-full overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  if (!renderedChildren) return null;

  return (
    <div
      ref={panelRef}
      className={`w-full h-full md:rounded-md shadow-2xl overflow-hidden z-50 transition-transform duration-400 ease-out ${
        mounted ? "translate-y-0" : "translate-y-full"
      } ${className}`}
    >
      {showDragHandle && isNotDesktop && (
        <div
          onPointerDown={dragHandlers.onPointerDown}
          onPointerMove={dragHandlers.onPointerMove}
          onPointerUp={dragHandlers.onPointerUp}
          onPointerCancel={dragHandlers.onPointerCancel}
          className="flex justify-center py-2 cursor-grab touch-none active:cursor-grabbing glass"
        >
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
      )}
      {renderedChildren}
    </div>
  );
}
