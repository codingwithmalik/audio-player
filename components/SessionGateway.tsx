"use client";

import { useSession } from "next-auth/react";
import AppLoadingScreen from "./Animations/appLoadingScreen";

export default function SessionGateway({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  if (status === "loading") return <AppLoadingScreen />;
  return <>{children}</>;
}
