import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ModuleDetail({
  params
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  const module = await prisma.module.findUnique({
    where: { slug: params.slug },
    include: { pages: { orderBy: { orderIndex: "asc" } } }
  });

  if (!module || !module.published) {
    return <div>Module not found.</div>;
  }

  const progress = session?.user
    ? await prisma.userProgress.findUnique({
        where: { userId_moduleId: { userId: session.user.id, moduleId: module.id } }
      })
    : null;

  return (
    <div className="space-y-8">
      <div className="card p-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-slate-500">
            {module.difficulty}
          </span>
          <span className="text-xs text-slate-500">{module.tags.join(", ")}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          {module.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">{module.description}</p>
        {progress && (
          <p className="text-sm text-teal-600">
            Progress: {progress.completedPages}/{module.pages.length} pages
          </p>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Lessons
        </h2>
        <ol className="space-y-3">
          {module.pages.map((page) => (
            <li key={page.id} className="card flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Lesson {page.orderIndex}</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {page.title}
                </h3>
              </div>
              <Link
                href={`/learn/${module.slug}/${page.orderIndex}`}
                className="text-sm font-semibold text-teal-600"
              >
                Start →
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
