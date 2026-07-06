"use client";

import HeaderLogo from "./headerLogo";
import HeaderSearch from "./headerSearch";
import HeaderAuth from "./headerAuth";

export default function HeaderComponent() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-2xl md:rounded-b-2xl">
      <div className="mx-auto flex h-14 w-full max-w-400 items-center justify-around gap-3 px-3 sm:px-5">
        <HeaderLogo />
        <HeaderSearch />
        <HeaderAuth />
      </div>
    </header>
  );
}
