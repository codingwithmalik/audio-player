export default function StandaloneLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen h-screen w-full justify-center items-center overflow-hidden">
      {children}
    </div>
  );
}
