"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/backgrounds.css";
import Library from "@/features/LeftSidebar/Library/library";

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
      className="md:flex flex-col w-full min-h-full overflow-hidden glass hidden rounded-lg"
      ref={sidebarRef}
    >
      <Library />
    </div>
  );
};

export default LeftSidebar;
