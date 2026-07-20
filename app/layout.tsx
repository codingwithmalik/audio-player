import React from "react";
import type { Metadata } from "next";
import ReduxProvider from "../providers/reduxprovider";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import LayoutContent from "@/components/LayoutContent";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Audious | Enjoy Music without Ads",
  description: "Play your music without limits",
  icons: { icon: "/logo.webp" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}  antialiased`}>
      <body className="h-screen min-h-screen overflow-hidden text-white bg-linear-to-br from-slate-950 via-fuchsia-950 to-cyan-950 w-screen">
        <ReduxProvider>
          <LayoutContent>
            <Toaster
              theme="dark"
              position="top-center"
              toastOptions={{
                unstyled: true,
              }}
            />
            {children}
          </LayoutContent>
        </ReduxProvider>
      </body>
    </html>
  );
}
