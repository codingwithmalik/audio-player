"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // ── Entrance animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !backdropRef.current || !dialogRef.current) return;

    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" },
    );

    gsap.fromTo(
      dialogRef.current,
      { opacity: 0, y: 12, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power3.out" },
    );
  }, [open]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      ref={backdropRef}
      onClick={onCancel}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a0a2e] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
      >
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition hover:scale-105 ${
              danger
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
