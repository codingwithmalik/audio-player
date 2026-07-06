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
  const sheetRef    = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  // Drag tracking
  const startY      = useRef(0);
  const lastY       = useRef(0);
  const lastTime    = useRef(0);
  const velocity    = useRef(0); // px/ms — positive = downward
  const isDragging  = useRef(false);

  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false); // ref mirror for use inside pointer handlers

  const COLLAPSED_PCT = 30; // sheet top at 30% from top = 70% height
  const EXPANDED_PCT  = 0;  // sheet top at 0% = full height

  // Keep ref in sync with state
  useEffect(() => { expandedRef.current = expanded; }, [expanded]);

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setVisible(true);
  }, [isOpen]);

  // ── Animate open/close ────────────────────────────────────────────────────
  useEffect(() => {
    const sheet    = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet || !backdrop) return;

    if (isOpen && visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(false);
      gsap.set(sheet,    { y: "100%" });
      gsap.set(backdrop, { opacity: 0, pointerEvents: "auto" });
      gsap.timeline()
        .to(backdrop, { opacity: 1, duration: 0.2, ease: "power2.out" })
        .to(sheet,    { y: `${COLLAPSED_PCT}%`, duration: 0.4, ease: "power3.out" }, "-=0.1");
    } else if (!isOpen && visible) {
      gsap.set(backdrop, { pointerEvents: "none" });
      gsap.timeline({
        onComplete: () => { setVisible(false); setExpanded(false); },
      })
        .to(sheet,    { y: "100%", duration: 0.3, ease: "power3.in" })
        .to(backdrop, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
    }
  }, [isOpen, visible]);

  // ── Expand / collapse ─────────────────────────────────────────────────────
  const expandSheet = useCallback(() => {
    setExpanded(true);
    gsap.to(sheetRef.current, { y: `${EXPANDED_PCT}%`, duration: 0.3, ease: "power3.out" });
  }, []);

  const collapseSheet = useCallback(() => {
    setExpanded(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    gsap.to(sheetRef.current, { y: `${COLLAPSED_PCT}%`, duration: 0.3, ease: "power3.out" });
  }, []);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Escape ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── Handle drag ───────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current     = e.clientY;
    lastY.current      = e.clientY;
    lastTime.current   = e.timeStamp;
    velocity.current   = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    // Velocity tracking — px per ms
    const dt = e.timeStamp - lastTime.current;
    if (dt > 0) velocity.current = (e.clientY - lastY.current) / dt;
    lastY.current    = e.clientY;
    lastTime.current = e.timeStamp;

    const delta      = e.clientY - startY.current;
    const baseY      = expandedRef.current ? EXPANDED_PCT : COLLAPSED_PCT;
    const dragPct    = (delta / window.innerHeight) * 100;
    const newY       = baseY + dragPct;

    // Clamp — don't drag above 0% or below 95%
    const clamped = Math.max(EXPANDED_PCT, Math.min(95, newY));
    gsap.set(sheet, { y: `${clamped}%` });
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const currentY  = gsap.getProperty(sheet, "y") as number;
    const pct       = (currentY / window.innerHeight) * 100;
    const vel       = velocity.current; // positive = moving down, negative = moving up

    // Velocity threshold — flick speed (px/ms)
    const FLICK = 0.5;

    if (expandedRef.current) {
      // Currently expanded
      if (vel > FLICK || pct > 20) {
        // Flicked down fast OR dragged past 20% → collapse
        collapseSheet();
      } else if (vel < -FLICK) {
        // Flicked up → stay expanded
        expandSheet();
      } else {
        // Slow drag — snap based on position
        pct > 15 ? collapseSheet() : expandSheet();
      }
    } else {
      // Currently collapsed
      if (vel < -FLICK || pct < 20) {
        // Flicked up fast OR dragged above 20% → expand
        expandSheet();
      } else if (vel > FLICK || pct > 60) {
        // Flicked down fast OR dragged past 60% → close
        onClose();
      } else {
        // Slow drag — snap back to collapsed
        collapseSheet();
      }
    }
  }, [expandSheet, collapseSheet, onClose]);

  // ── Content swipe up to expand ────────────────────────────────────────────
  const contentStartY = useRef(0);

  const handleContentPointerDown = useCallback((e: React.PointerEvent) => {
    contentStartY.current = e.clientY;
  }, []);

  const handleContentPointerMove = useCallback((e: React.PointerEvent) => {
    if (expandedRef.current) return;
    const delta = e.clientY - contentStartY.current;
    if (delta < -20) expandSheet();
  }, [expandSheet]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!visible || typeof window === "undefined") return null;

  return createPortal(
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        style={{ opacity: 0, pointerEvents: "none" }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col rounded-t-2xl border-t border-white/10 shadow-2xl"
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
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onPointerDown={handleContentPointerDown}
          onPointerMove={handleContentPointerMove}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}