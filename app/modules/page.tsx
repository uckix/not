import { prisma } from "@/lib/prisma";
import ModuleCard from "@/components/module-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ModulesPage({
  searchParams
}: {
  searchParams?: { q?: string; difficulty?: string; tag?: string };
}) {
  const session = await getServerSession(authOptions);
  const filters = {
    published: true,
    title: searchParams?.q
      ? { contains: searchParams.q, mode: "insensitive" as const }
      : undefined,
    difficulty: searchParams?.difficulty
      ? (searchParams.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")
      : undefined,
    tags: searchParams?.tag ? { has: searchParams.tag } : undefined
  };

  const modules = await prisma.module.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pages: true } } }
  });

  const progress = session?.user
    ? await prisma.userProgress.findMany({
        where: { userId: session.user.id },
        select: { moduleId: true, completedPages: true }
      })
    : [];

  const progressMap = new Map(progress.map((item) => [item.moduleId, item]));

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Modules
        </h1>
        <form className="flex flex-col gap-3 md:flex-row">
          <input
            name="q"
            placeholder="Search modules"
            className="flex-1 rounded-lg border border-border bg-white/80 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900"
            defaultValue={searchParams?.q}
          />
          <select
            name="difficulty"
            defaultValue={searchParams?.difficulty}
            className="rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          >
            <option value="">All difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <input
            name="tag"
            placeholder="Tag"
            className="rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
            defaultValue={searchParams?.tag}
          />
          <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
            Filter
          </button>
        </form>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => {
          const moduleProgress = progressMap.get(module.id);
          const totalPages = module._count.pages || 1;
          const percentage = moduleProgress
            ? Math.min(100, Math.round((moduleProgress.completedPages / totalPages) * 100))
            : undefined;
          return (
            <ModuleCard
              key={module.id}
              module={module}
              progress={percentage}
            />
          );
        })}
      </div>
    </div>
  );
}
