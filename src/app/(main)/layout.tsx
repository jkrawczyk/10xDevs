import { SideNav } from "@/components/navigation/SideNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex">
      <SideNav />
      <main className="flex-1 overflow-y-auto px-8">
        {children}
      </main>
    </div>
  );
} 