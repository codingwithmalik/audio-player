import React from "react";
import type { Metadata } from "next";
import ReduxProvider from "../providers/reduxprovider";
import { Poppins } from "next/font/google";
import Header from "../components/header";
// import Player from "../components/player";
import Player from "@/features/Player/player";
import Rightsidebar from "@/components/rightsidebar";
import LeftSidebar from "@/components/leftsidebar";
import BottomNav from "@/components/mobileNavbar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Audious",
  description: "Play your music without limits",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}  antialiased`}>
      <body className="h-screen min-h-screen overflow-hidden text-white bg-linear-to-br from-slate-950 via-fuchsia-950 to-cyan-950 w-screen">
        <ReduxProvider>
          <div className="hidden md:grid h-screen grid-rows-[auto_1fr_auto] max-w-screen">
            <Header />
            <div className="grid gap-2 m-1 my-4 overflow-hidden grid-cols-[80px_6fr] lg:grid-cols-[clamp(260px,20vw,320px)_3fr_clamp(260px,20vw,320px)] layout-grid">
              <LeftSidebar />
              <div className="overflow-hidden min-w-0">{children}</div>
              <div className="hidden lg:block overflow-hidden min-w-0">
                <Rightsidebar />
              </div>
            </div>
            <Player />
          </div>
          <div className="flex md:hidden flex-col h-screen">
            <main className="flex-1 overflow-y-auto pb-34">{children}</main>
            <div className="fixed bottom-16 left-0 right-0 z-40">
              <Player />
            </div>
            <BottomNav />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
