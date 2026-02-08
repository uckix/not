import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ThemeToggle from "@/components/theme-toggle";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border-b border-border bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">
          MiniHackMe
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <Link href="/modules">Modules</Link>
          {session?.user ? (
            <>
              <Link href="/profile">Profile</Link>
              {session.user.role === "ADMIN" && <Link href="/admin">Admin</Link>}
              <Link href="/api/auth/signout">Sign out</Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Sign up</Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
