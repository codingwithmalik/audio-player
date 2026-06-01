"use client";
import React from "react";
import { useDevice } from "../contexts/devicecontext";
import "../styles/backgrounds.css"
const LeftSidebar = () => {
  const { isPC } = useDevice();
  return (
    <div>
      <div
        className={
          isPC
            ? "flex items-center justify-center max-w-full h-full overflow-hidden glass"
            : "hidden"
        }
      >
        {/* hey its you , yes its me no its not you its me if this is not you then
        who are you ? */}
      </div>
    </div>
  );
};

export default LeftSidebar;
