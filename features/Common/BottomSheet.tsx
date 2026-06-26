"use client";

import { useEffect, useRef, useCallback, useState } from "react";
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
  const quickY      = useRef<gsap.QuickToFunc | null>(null);
  const touchStartY = useRef(0);
  const dragDelta   = useRef(0);

  // Controls DOM presence — stays true during exit animation
  const [visible, setVisible] = useState(false);

  // ── Step 1: mount when isOpen becomes true ────────────────────────────────
  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  // ── Step 2: animate after DOM is rendered (visible changed) ──────────────
  useEffect(() => {
    const sheet    = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet || !backdrop) return;

    if (isOpen && visible) {
      // Refs exist now — animate in
      quickY.current = gsap.quickTo(sheet, "y", {
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.set(sheet,    { y: "100%" });
      gsap.set(backdrop, { opacity: 0, pointerEvents: "auto" });

      gsap.timeline()
        .to(backdrop, { opacity: 1, duration: 0.2, ease: "power2.out" })
        .to(sheet,    { y: "30%",  duration: 0.4, ease: "power3.out" }, "-=0.1");

    } else if (!isOpen && visible) {
      // Animate out then unmount
      gsap.set(backdrop, { pointerEvents: "none" });

      gsap.timeline({ onComplete: () => setVisible(false) })
        .to(sheet,    { y: "100%", duration: 0.3, ease: "power3.in" })
        .to(backdrop, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
    }
  }, [isOpen, visible]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── Touch swipe to close ──────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    dragDelta.current   = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta < 0) return;
    dragDelta.current = delta;
    const y = 30 + (delta / window.innerHeight) * 100;
    quickY.current?.(`${y}%`);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (dragDelta.current > window.innerHeight * 0.2) {
      onClose();
    } else {
      gsap.to(sheetRef.current, { y: "30%", duration: 0.3, ease: "power3.out" });
    }
    dragDelta.current = 0;
  }, [onClose]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!visible) return null;
  if (typeof window === "undefined") return null;

  return createPortal(
    <div className="sm:hidden">
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
        className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col
                   rounded-t-2xl border-t border-white/10 shadow-2xl"
        style={{
          height: "100dvh",
          background: "linear-gradient(180deg, #1a0a2e 0%, #120822 100%)",
          transform: "translateY(100%)",
        }}
      >
        {/* Drag handle */}
        <div
          className="flex flex-col items-center pt-3 shrink-0 select-none
                     cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-white/20 mb-3" />
          {title && (
            <div className="w-full flex items-center justify-between px-5 pb-3">
              <h3 className="text-white font-semibold text-base">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center
                           justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="w-full h-px bg-white/10" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}