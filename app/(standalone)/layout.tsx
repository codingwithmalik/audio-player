export default function StandaloneLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-y-auto">
      {children}
    </div>
  );
}
