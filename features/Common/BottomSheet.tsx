"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const COLLAPSED = "30%";
  const EXPANDED = "0%";

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setVisible(true);
  }, [isOpen]);

  // ── Animate ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet || !backdrop) return;

    if (isOpen && visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(false);
      gsap.set(sheet, { y: "100%" });
      gsap.set(backdrop, { opacity: 0, pointerEvents: "auto" });
      gsap
        .timeline()
        .to(backdrop, { opacity: 1, duration: 0.2, ease: "power2.out" })
        .to(
          sheet,
          { y: COLLAPSED, duration: 0.4, ease: "power3.out" },
          "-=0.1",
        );
    } else if (!isOpen && visible) {
      gsap.set(backdrop, { pointerEvents: "none" });
      gsap
        .timeline({
          onComplete: () => {
            setVisible(false);
            setExpanded(false);
          },
        })
        .to(sheet, { y: "100%", duration: 0.3, ease: "power3.in" })
        .to(
          backdrop,
          { opacity: 0, duration: 0.2, ease: "power2.in" },
          "-=0.1",
        );
    }
  }, [isOpen, visible]);

  // ── Expand / collapse helpers ─────────────────────────────────────────────
  const expandSheet = useCallback(() => {
    setExpanded(true);
    gsap.to(sheetRef.current, {
      y: EXPANDED,
      duration: 0.35,
      ease: "power3.out",
    });
  }, []);

  const collapseSheet = useCallback(() => {
    setExpanded(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    gsap.to(sheetRef.current, {
      y: COLLAPSED,
      duration: 0.35,
      ease: "power3.out",
    });
  }, []);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── Drag handle pointer events ────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const sheet = sheetRef.current;
      if (!sheet) return;
      const delta = e.clientY - startY.current;
      if (delta < 0) return; // block upward drag on handle
      const baseY = expanded ? 0 : 30;
      const dragPercent = (delta / window.innerHeight) * 100;
      gsap.set(sheet, { y: `${baseY + dragPercent}%` });
    },
    [expanded],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const currentY = gsap.getProperty(sheet, "y") as number;

    if (expanded) {
      if (currentY > window.innerHeight * 0.2) collapseSheet();
      else gsap.to(sheet, { y: EXPANDED, duration: 0.3, ease: "power3.out" });
    } else {
      if (currentY > window.innerHeight * 0.5) onClose();
      else gsap.to(sheet, { y: COLLAPSED, duration: 0.3, ease: "power3.out" });
    }
  }, [expanded, collapseSheet, onClose]);

  // ── Content area pointer events — swipe up to expand ─────────────────────
  const handleContentPointerDown = useCallback((e: React.PointerEvent) => {
    startY.current = e.clientY;
  }, []);

  const handleContentPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (expanded) return; // already expanded, browser scrolls naturally
      const delta = e.clientY - startY.current;
      if (delta < -20) expandSheet(); // swiping up → expand
    },
    [expanded, expandSheet],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  if (!visible || typeof window === "undefined") return null;

  return createPortal(
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9998"
        style={{ opacity: 0, pointerEvents: "none" }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-x-0 bottom-0 z-9999 flex flex-col rounded-t-2xl border-t border-white/10 shadow-2xl"
        style={{
          height: "100dvh",
          background: "linear-gradient(180deg, #1a0a2e 0%, #120822 100%)",
          transform: "translateY(100%)",
        }}
      >
        {/* Drag handle */}
        <div
          className="flex flex-col items-center pt-3 shrink-0 select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <div className="w-10 h-1 rounded-full bg-white/20 mb-3" />
          {title && (
            <div className="w-full flex items-center justify-between px-5 pb-3">
              <h3 className="text-white font-semibold text-base">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="w-full h-px bg-white/10" />
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className="flex-1 overscroll-contain"
          style={{
            overflowY: expanded ? "auto" : "hidden",
            overflowX: "hidden",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
          onPointerDown={handleContentPointerDown}
          onPointerMove={handleContentPointerMove}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
