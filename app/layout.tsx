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
          <LayoutContent>
            <Toaster
              theme="dark"
              position="top-center"
              toastOptions={{
                unstyled: true,
                // classNames: {
                //   toast:
                //     "flex items-center gap-3 bg-purple-950 backdrop-blur-md border border-white/10 rounded-xl shadow-xl px-4 py-3 w-full",
                //   title: "text-white text-sm font-medium",
                //   description: "text-white/60 text-xs",
                //   actionButton:
                //     "bg-white text-black rounded-full text-xs font-semibold px-3 py-1.5",
                //   cancelButton:
                //     "bg-white/50 text-white rounded-full text-xs px-3 py-1.5",
                //   closeButton: "bg-white/50 text-white/60 hover:text-white",
                //   success: "border-green-500/30",
                //   error: "border-red-500/30",
                // },
              }}
            />
            {children}
          </LayoutContent>
        </ReduxProvider>
      </body>
    </html>
  );
}
