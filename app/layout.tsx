import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "MiniHackMe",
  description: "A minimal, sleek learning platform inspired by TryHackMe."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers session={session}>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
