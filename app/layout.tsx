import type { Metadata } from "next";
import ReduxProvider from "../providers/reduxprovider";
import { Poppins } from "next/font/google";
import Header from "../components/header";
// import Player from "../components/audioplayerclaude"
import Rightsidebar from "@/components/rightsidebar";
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
      <body className="min-h-full flex flex-col bg-linear-to-br from-slate-950 via-fuchsia-950 to-cyan-950">
        <ReduxProvider>
          <Header />
          {children}
          {/* <Player /> */}
          <Rightsidebar />
        </ReduxProvider>
      </body>
    </html>
  );
}
