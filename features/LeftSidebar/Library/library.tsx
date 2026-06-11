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

export default function Sidebar() {
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

  // Init OS on the aside directly
  useEffect(() => {
    if (asideRef.current) initOS(asideRef.current);
  }, [initOS]);

  // Once OS is ready, grab its viewport and hand it to ScrollTrigger
  useEffect(() => {
    const viewport = osInstance()?.elements().viewport;
    if (!viewport || !headerRef.current) return;

    gsap.to(headerRef.current, {
      background:"#100823",
      boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
      delay:0,
      ease: "none",
      scrollTrigger: {
        trigger: viewport,
        scroller: viewport, // ← OS internal viewport, not the aside
        start: "top top",
        end: "+=80",
        scrub: 0,
      },
    });
  }, [osInstance]);

  return (
    <aside
      ref={asideRef}
      className="min-h-full  
      h-full
      w-full
      bg-white/5
      "
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
      {}
    </aside>
  );
}
