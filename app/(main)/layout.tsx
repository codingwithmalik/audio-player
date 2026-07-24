import LayoutContent from "@/components/LayoutContent";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LayoutContent>{children}</LayoutContent>;
}
