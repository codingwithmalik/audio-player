import React from "react";
import type { Metadata } from "next";
import ReduxProvider from "../providers/reduxprovider";
import { Poppins } from "next/font/google";
import Header from "../components/header";
import Player from "../components/audioplayerclaude";
import Rightsidebar from "@/components/rightsidebar";
import LeftSidebar from "@/components/leftsidebar";
import { DeviceProvider } from "@/contexts/devicecontext";
import "./globals.css";
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Audious",
  description: "Play your music without limits",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="text-white bg-linear-to-br from-slate-950 via-fuchsia-950 to-cyan-950 h-full">
        <ReduxProvider>
          <DeviceProvider>
            <div className="grid  min-h-full grid-rows-[auto_1fr_auto] overflow-hidden">
              <Header />
              {/* <div className="grid grid-cols-1 md:grid-cols-[20vw_1fr_20vw] gap-2"> */}
              <div className="hidden md:grid grid-cols-1 gap-2 md:grid-cols-[80px_1fr_320px] lg:grid-cols-[280px_1fr_320px] m-1 my:4">
                <LeftSidebar />
                <div className="overflow-hidden">{children}</div>
                <Rightsidebar />
              </div>
              <div className="flex items-center justify-center h-full w-full md:hidden m-auto">
                {children}
              </div>
              <Player />
            </div>
          </DeviceProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
