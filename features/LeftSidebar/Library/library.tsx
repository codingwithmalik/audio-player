"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LibraryHeader from "./libraryHeader";
import LibrarySearch from "./librarySearchbar";
import LibraryList from "./libraryList";
import LibraryFilters from "./libraryfilters";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import LocalFilesSection from "../LocalFiles/LocalFilesSection";
import { useAppSelector } from "@/globalHooks";
import LibraryTeaser from "./libraryTeaser";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  scrollable?: boolean;
};

export default function Library({ scrollable = false }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const asideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [showLocalFiles, setShowLocalFiles] = useState(false);

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
    if (!scrollable && asideRef.current && !showLocalFiles && isAuthenticated)
      initOS(asideRef.current);
  }, [initOS, scrollable, showLocalFiles, isAuthenticated]);

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
  }, [scrollable, osInstance, isAuthenticated]);

  if (!isAuthenticated) return <LibraryTeaser />;

  // Local Files renders as a layer on top of the regular library — same
  // container, swapped content, with its own back button to return.
  return (
    <>
      <div className={`${showLocalFiles ? "flex" : "hidden"}`}>
        <LocalFilesSection onBack={() => setShowLocalFiles(false)} />
      </div>
      <aside
        ref={asideRef}
        className={` min-h-full h-full w-full overflow-x-hidden scrollbar-none bg-white/5 ${scrollable ? "overflow-y-auto" : ""}`}
        style={{ display: showLocalFiles ? "none" : undefined }}
      >
        <div
          ref={headerRef}
          className="sticky top-0 left-0 p-4 pb-2 w-full z-50 will-change-transform md:rounded-t-md"
        >
          <LibraryHeader />
          <LibraryFilters />
        </div>
        <div className="pr-4 pb-4 pl-3">
          <LibrarySearch />
          <LibraryList ShowLocalFiles={() => setShowLocalFiles(true)} />
        </div>
      </aside>
    </>
  );
}
