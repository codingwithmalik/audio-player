"use client";

/**
 * BottomSheet
 * -----------
 * Mobile-only sliding bottom sheet. Portalled to document.body.
 * On sm+ screens renders nothing — desktop dropdowns handle themselves.
 *
 * Behavior:
 *   - Opens at 70% height (y: 30%), backdrop covers top 30%
 *   - Scrolling content expands sheet to full height (y: 0%)
 *   - Scrolling back to top collapses back to 70%
 *   - Swipe down on drag handle closes the sheet
 *   - Backdrop click closes the sheet
 *
 * Usage:
 *   <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Sort by">
 *     <YourContent />
 *   </BottomSheet>
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const COLLAPSED_Y = "30%"; // sheet sits at 70% height
const EXPANDED_Y = "0%"; // sheet takes full height
const CLOSED_Y = "100%"; // sheet hidden below screen

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isExpanded = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  // Touch tracking for swipe-to-close
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const isDragging = useRef(false);

  // GSAP quickTo for performant touch following
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  // ── Body scroll lock ──────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── GSAP setup ────────────────────────────────────────────────────────────

  useGSAP(
    () => {
      const sheet = sheetRef.current;
      const backdrop = backdropRef.current;
      if (!sheet || !backdrop) return;

      // Setup quickTo for touch dragging
      quickY.current = gsap.quickTo(sheet, "y", {
        duration: 0.15,
        ease: "power2.out",
      });

      if (isOpen && !isMounted) {
        // ── Enter animation ──
        setIsMounted(true);
        isExpanded.current = false;

        gsap.set(sheet, { y: CLOSED_Y });
        gsap.set(backdrop, { opacity: 0 });

        gsap
          .timeline()
          .to(backdrop, {
            opacity: 1,
            display:"flex",
            duration: 0.25,
            ease: "power2.out",
          })
          .to(
            sheet,
            {
              y: COLLAPSED_Y,
              duration: 0.45,
              ease: "power3.out",
            },
            "-=0.15",
          );
      } else if (!isOpen && isMounted) {
        // ── Exit animation ──
        setIsMounted(false);

        gsap
          .timeline({
            onComplete: () => {
              isExpanded.current = false;
            },
          })
          .to(sheet, {
            y: CLOSED_Y,
            duration: 0.35,
            ease: "power3.in",
          })
          .to(
            backdrop,
            {
              opacity: 0,
              display:"none",
              duration: 0.2,
              ease: "power2.in",
            },
            "-=0.15",
          );
      }
    },
    { scope: sheetRef, dependencies: [isOpen] },
  );

  // ── Scroll detection — expand / collapse ──────────────────────────────────

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet || !backdrop) return;

    const scrollTop = (e.target as HTMLDivElement).scrollTop;

    if (scrollTop > 0 && !isExpanded.current) {
      // User scrolled down — expand to full height
      isExpanded.current = true;
      gsap.to(sheet, {
        y: EXPANDED_Y,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(backdrop, { opacity: 0.7, duration: 0.25 });
    } else if (scrollTop === 0 && isExpanded.current) {
      // User scrolled back to top — collapse to 70%
      isExpanded.current = false;
      gsap.to(sheet, {
        y: COLLAPSED_Y,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(backdrop, { opacity: 1, duration: 0.25 });
    }
  }, []);

  // ── Touch handlers — swipe to close ──────────────────────────────────────

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    touchCurrentY.current = e.touches[0].clientY;
    const delta = touchCurrentY.current - touchStartY.current;

    // Only allow dragging downward
    if (delta <= 0) return;

    // Follow finger in real time
    const baseY:number = isExpanded.current ? 0 : 30;
    const newY:number = baseY + (delta / window.innerHeight) * 100;
    quickY.current?.(newY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const delta = touchCurrentY.current - touchStartY.current;
    const threshold = window.innerHeight * 0.18;

    if (delta > threshold) {
      onClose();
    } else {
      // Snap back
      gsap.to(sheet, {
        y: isExpanded.current ? EXPANDED_Y : COLLAPSED_Y,
        duration: 0.3,
        ease: "power3.out",
      });
    }
  }, [onClose]);

  // ── Close on Escape ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── Only render on mobile, skip SSR ──────────────────────────────────────

  if (typeof window === "undefined") return null;
  if (!isOpen && !isMounted) return null;

  const sheet = (
    <div className="sm:hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        style={{ opacity: 0 }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed left-0 right-0 bottom-0 z-[9999]
                   flex flex-col rounded-t-2xl overflow-hidden
                   border-t border-white/10 shadow-2xl"
        style={{
          height: "100dvh",
          transform: `translateY(${CLOSED_Y})`,
          willChange: "transform",
          background: "linear-gradient(180deg, #1a0a2e 0%, #120822 100%)",
        }}
      >
        {/* ── Drag handle area ── */}
        <div
          className="flex flex-col items-center pt-3 pb-2 shrink-0
                     cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Handle pill */}
          <div className="w-10 h-1 rounded-full bg-white/20 mb-3" />

          {/* Title row */}
          {title && (
            <div className="w-full flex items-center justify-between px-5 pb-3">
              <h3 className="text-white font-semibold text-base">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                           text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="w-full h-px bg-white/10" />
        </div>

        {/* ── Scrollable content ── */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
