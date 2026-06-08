"use client";
import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/backgrounds.css";
import Library from "@/features/LeftSidebar/Library/library";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const LeftSidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      {
        x: -40,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
    );
  }, []);
  return (
    <div
      className="md:flex w-full min-h-full  overflow-hidden glass hidden rounded-lg "
      ref={sidebarRef}
    >
      <OverlayScrollbarsComponent
        defer
        options={{ scrollbars: { theme: "os-theme-light", autoHide: "leave" , autoHideDelay:0} }}
        className="h-full w-full "
      >
        <Library />
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default LeftSidebar;
