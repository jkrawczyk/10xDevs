import { SideNav } from "@/components/navigation/SideNav";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 