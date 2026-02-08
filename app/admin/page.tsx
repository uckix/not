import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [modulesCount, usersCount] = await Promise.all([
    prisma.module.count(),
    prisma.user.count()
  ]);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Manage rooms, lessons, and users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Modules</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {modulesCount}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Users</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {usersCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/modules" className="card p-4 text-sm font-medium">
          Manage modules →
        </Link>
        <Link href="/admin/users" className="card p-4 text-sm font-medium">
          Manage users →
        </Link>
      </div>
    </div>
  );
}
