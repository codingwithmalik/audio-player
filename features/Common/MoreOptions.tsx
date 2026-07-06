"use client";

import { useEffect, useLayoutEffect, useRef, useState, RefObject } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, ChevronLeft, LucideIcon } from "lucide-react";
import Submenu, { SubOption } from "@/features/Common/Submenu";

// ─── Types ────────────────────────────────────────────────────────────────────

type Placement =
  | "right-start"
  | "right-end"
  | "left-start"
  | "left-end"
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

export type MoreOption = {
  id: string;
  label?: string;
  icon?: LucideIcon;
  iconFilled?: boolean;
  action?: () => void;
  separatorAbove?: boolean;
  submenu?: SubOption[];
  submenuPosition?: "right" | "left";
  submenuPlaceholder?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MoreOptions({
  options,
  variant = "dropdown",
  onClose,
  confirmDialog,
  // dropdown-only props
  anchorRef,
  placement = "bottom-end",
  offset = 6,
}: {
  options: MoreOption[];
  variant?: "dropdown" | "sheet";
  onClose: () => void;
  confirmDialog?: React.ReactNode;
  anchorRef?: RefObject<HTMLButtonElement | null>;
  placement?: Placement;
  offset?: number;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [ready, setReady] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState("main");

  // ── Position (dropdown only) ──────────────────────────────────────────────
  useLayoutEffect(() => {
    if (variant !== "dropdown" || !anchorRef?.current || !menuRef.current)
      return;

    const updatePosition = () => {
      if (!anchorRef.current || !menuRef.current) return;

      const anchor = anchorRef.current.getBoundingClientRect();
      const menu = menuRef.current.getBoundingClientRect();
      const pad = 8;

      let top = 0,
        left = 0;

      switch (placement) {
        case "right-start":
          top = anchor.top;
          left = anchor.right + offset;
          break;
        case "right-end":
          top = anchor.bottom - menu.height;
          left = anchor.right + offset;
          break;
        case "left-start":
          top = anchor.top;
          left = anchor.left - menu.width - offset;
          break;
        case "left-end":
          top = anchor.bottom - menu.height;
          left = anchor.left - menu.width - offset;
          break;
        case "bottom-start":
          top = anchor.bottom + offset;
          left = anchor.left;
          break;
        case "bottom-end":
          top = anchor.bottom + offset;
          left = anchor.right - menu.width;
          break;
        case "top-start":
          top = anchor.top - menu.height - offset;
          left = anchor.left;
          break;
        case "top-end":
          top = anchor.top - menu.height - offset;
          left = anchor.right - menu.width;
          break;
      }

      top = Math.max(
        pad,
        Math.min(top, window.innerHeight - menu.height - pad),
      );
      left = Math.max(
        pad,
        Math.min(left, window.innerWidth - menu.width - pad),
      );

      setStyle({ position: "fixed", top, left, zIndex: 9999 });
      setReady(true);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition, true);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition, true);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [variant, placement, offset, anchorRef]);

  const confirmOpenRef = useRef(false);

  // update it whenever confirmDialog changes
  useEffect(() => {
    confirmOpenRef.current = !!confirmDialog;
  }, [confirmDialog]);

  // ── Outside click + Escape ────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // console.log("click fired");
      // console.log("confirmOpen:", confirmOpenRef.current);
      // console.log("menu contains:", menuRef.current?.contains(target));
      // console.log("anchor contains:", anchorRef?.current?.contains(target));
      if (confirmDialog) return; // confirm dialog is open — block
      if (menuRef.current?.contains(target)) return; // click inside menu — block
      if (anchorRef?.current?.contains(target)) return; // click on trigger — block
      onClose();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmDialog) onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, confirmDialog, anchorRef]);

  // ── Hover logic (desktop only) ────────────────────────────────────────────
  const handleOptionEnter = (option: MoreOption) => {
    if (variant === "sheet") return;
    setActiveSubmenu(option.submenu ? option.id : null);
  };

  const activeOption = options.find((o) => o.id === sheetView);

  // ── Content ───────────────────────────────────────────────────────────────
  const content = (
    <div
      ref={menuRef}
      style={
        variant === "dropdown"
          ? { ...style, visibility: ready ? "visible" : "hidden" }
          : undefined
      }
      className={
        variant === "dropdown"
          ? "min-w-55 max-w-64 bg-[#1a0a2e] border border-white/10 rounded-xl shadow-2xl py-2"
          : undefined
      }
    >
      {/* ── Main options ── */}
      {(variant === "dropdown" || sheetView === "main") &&
        options.map((option) => {
          const Icon = option.icon;
          const isSubmenuOpen = activeSubmenu === option.id;

          return (
            <div
              key={option.id}
              className="relative"
              onMouseEnter={() => handleOptionEnter(option)}
            >
              {option.separatorAbove && (
                <div className="border-t border-white/10" />
              )}

              <button
                onClick={
                  option.submenu && variant === "sheet"
                    ? () => setSheetView(option.id)
                    : option.submenu
                      ? undefined
                      : option.action
                }
                className={`group w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/10 transition-colors duration-150 text-white`}
              >
                <span className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${
                        option.iconFilled
                          ? "text-purple-600 fill-purple-600"
                          : "text-white/60 group-hover:text-purple-600"
                      }`}
                    />
                  )}
                  <span className="group-hover:text-purple-600">
                    {option.label}
                  </span>
                </span>

                {option.submenu && (
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-purple-600" />
                )}
              </button>

              {/* Desktop submenu */}
              {option.submenu && (
                <div
                  className={`transition-opacity duration-150 ${
                    isSubmenuOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Submenu
                    options={option.submenu}
                    searchPlaceholder={option.submenuPlaceholder ?? "Search..."}
                    position={option.submenuPosition ?? "right"}
                    maxHeight={220}
                  />
                </div>
              )}
            </div>
          );
        })}

      {/* ── Sheet submenu view ── */}
      {variant === "sheet" && sheetView !== "main" && activeOption?.submenu && (
        <>
          <button
            onClick={() => setSheetView("main")}
            className="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white transition-colors w-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="border-t border-white/10" />
          <Submenu
            inline
            options={activeOption.submenu}
            searchPlaceholder={activeOption.submenuPlaceholder ?? "Search..."}
            position={activeOption.submenuPosition ?? "right"}
            maxHeight="100%"
          />
        </>
      )}

      {/* ── Confirm dialog slot ── */}
      {confirmDialog}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  // sheet → render inline, dropdown → portal to body
  if (variant === "sheet") return content;
  if (typeof window === "undefined") return null;
  return createPortal(content, document.body);
}
