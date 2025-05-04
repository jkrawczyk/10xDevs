import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserNav } from "@/components/auth/UserNav";
import { AuthProvider } from "@/lib/auth/AuthContext";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Text Correction App",
  description: "Text correction application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="h-16 border-b">
              <div className="flex items-center h-full">
                <div className="text-lg font-semibold px-4">
                  Text Correction
                </div>
                <div className="flex-1" />
                <UserNav />
              </div>
            </header>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
