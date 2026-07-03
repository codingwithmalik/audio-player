"use client";

import { ChevronRight, ChevronLeft, LucideIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Submenu, { SubOption } from "@/features/Common/Submenu";

// ─── Types ────────────────────────────────────────────────────────────────────

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
}: {
  options: MoreOption[];
  variant?: "dropdown" | "sheet";
  onClose: () => void;
  confirmDialog?: React.ReactNode; // slot for ConfirmDialog
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<string>("main");

  // ── Outside click ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // ── Hover logic — desktop only ────────────────────────────────────────────
  const handleOptionEnter = (option: MoreOption) => {
    if (variant === "sheet") return;
    setActiveSubmenu(option.submenu ? option.id : null);
  };

  // ── Active submenu options ────────────────────────────────────────────────
  const activeOption = options.find((o) => o.id === sheetView);

  return (
    <div ref={wrapperRef}>
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
                <div className="border-t border-white/10 my-1.5" />
              )}

              <button
                onClick={
                  option.submenu && variant === "sheet"
                    ? () => setSheetView(option.id)
                    : option.submenu
                      ? undefined
                      : option.action
                }
                className={`group w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/10 transition-colors duration-150 
                    text-white
                `}
              >
                <span className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        option.iconFilled
                          ? "text-purple-600 fill-purple-4600"
                          : "text-white/60 group-hover:text-purple-600"
                      }`}
                    />
                  )}
                  <span className={"group-hover:text-purple-600"}>
                    {option.label}
                  </span>
                </span>

                {option.submenu && (
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-purple-600 transition-colors" />
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
}
