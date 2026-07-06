"use client";

import { useEffect, useLayoutEffect, useRef, useState, RefObject } from "react";
import { createPortal } from "react-dom";

type Placement =
  | "right-start"
  | "right-end"
  | "left-start"
  | "left-end"
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

interface FloatingMenuProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: React.ReactNode;
  placement?: Placement;
  offset?: number;
  className?: string;
  disableoutsideclick?: boolean;
}

export default function FloatingMenu({
  open,
  anchorRef,
  onClose,
  children,
  placement = "right-start",
  offset = 6,
  className = "",
  disableoutsideclick,
}: FloatingMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!anchorRef.current || !menuRef.current) return;

    const anchor = anchorRef.current.getBoundingClientRect();
    const menu = menuRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

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

    const padding = 8;

    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - menu.height - padding),
    );

    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - menu.width - padding),
    );

    setStyle({
      position: "fixed",
      top,
      left,
      zIndex: 9998,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("resize", updatePosition, true);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition, true);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, placement, offset, anchorRef]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        disableoutsideclick ||
        menuRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose ,disableoutsideclick, anchorRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div ref={menuRef} style={style} className={className}>
      {children}
    </div>,
    document.body,
  );
}
