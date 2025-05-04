export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
} 