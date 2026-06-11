"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LibraryHeader from "./libraryHeader";
import LibrarySearch from "./librarySearchbar";
import LibraryList from "./libraryList";
import LibraryFilters from "./libraryfilters";
import { useOverlayScrollbars } from "overlayscrollbars-react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  scrollable?: boolean;
};

export default function Library({ scrollable = false }: Props) {
  const asideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [initOS, osInstance] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "os-theme-light",
        autoHide: "leave",
        autoHideDelay: 0,
      },
    },
    defer: false,
  });

  // Init OS only when used as sidebar panel
  useEffect(() => {
    if (!scrollable && asideRef.current) initOS(asideRef.current);
  }, [initOS, scrollable]);

  // Scroll shadow effect
  useEffect(() => {
    // Get the actual scrolling element — OS viewport or the aside itself
    const scroller = scrollable
      ? asideRef.current
      : osInstance()?.elements().viewport;

    if (!scroller || !headerRef.current) return;

    ScrollTrigger.create({
      trigger: scroller,
      scroller: scroller,
      start: "top+=10 top",
      // gsap.set applies instantly with no tween — no camera flash effect
      onEnter: () =>
        gsap.set(headerRef.current, {
          background: "#100823",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        }),
      onLeaveBack: () =>
        gsap.set(headerRef.current, {
          background: "transparent",
          boxShadow: "none",
        }),
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [scrollable, osInstance]);

  return (
    <aside
      ref={asideRef}
      className={`min-h-full h-full w-full bg-white/5 ${scrollable ? "overflow-y-auto scrollbar-none" : ""}`}
    >
      <div
        ref={headerRef}
        className="sticky top-0 left-0 p-4 pb-2 w-full z-50 will-change-transform rounded-t-md"
      >
        <LibraryHeader />
        <LibraryFilters />
      </div>
      <div className="p-4">
        <LibrarySearch />
        <LibraryList />
      </div>
    </aside>
  );
}
