import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/auth/UserNav";
import { SideNav } from "@/components/navigation/SideNav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Text Correction App",
  description: "Aplikacja do korekty tekstu",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="pl">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container flex items-center justify-between h-16">
              <div className="text-lg font-semibold">
                Text Correction
              </div>
              <UserNav user={!!user} />
            </div>
          </header>
          <div className="flex-1 flex">
            <SideNav />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
