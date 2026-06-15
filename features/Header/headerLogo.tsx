"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo() {


  return (
    <div className="flex items-center">
      {/* Logo — left edge */}
      <Link href="/">
        <div className="flex h-10 w-10 items-center justify-center bg-white shadow-lg sm:h-11 sm:w-11 rounded-full">
          <Image
            src="/icon.png"
            alt="Logo"
            width={44}
            height={44}
            className="rounded-full"
          />
        </div>
      </Link>
    </div>
  );
}