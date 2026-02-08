import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Modules
        </h1>
        <Link
          href="/admin/modules/new"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          New module
        </Link>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="card flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {module.title}
              </h2>
              <p className="text-xs text-slate-500">
                {module.slug} · {module.published ? "Published" : "Draft"}
              </p>
            </div>
            <Link
              href={`/admin/modules/${module.id}`}
              className="text-sm text-teal-600"
            >
              Edit →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
