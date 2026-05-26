"use client";
import React from "react";
import { useDevice } from "../contexts/devicecontext";

const LeftSidebar = () => {
  const { isPC } = useDevice();
  return (
    <div>
      <div
        className={
          isPC
            ? "flex items-center justify-center top-[10vh] left-0 m-1 p-2 absolute min-h-[75vh] max-w-[20vw]  bg-white/5  border-b border-white/10  backdrop-blur-2xl md:rounded-2xl"
            : "hidden"
        }
      >
        hey its you , yes its me no its not you its me if this is not you then
        who are you ?
      </div>
    </div>
  );
};

export default LeftSidebar;
