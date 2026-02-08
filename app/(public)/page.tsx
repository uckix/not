import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ModuleCard from "@/components/module-card";

export default async function HomePage() {
  const modules = await prisma.module.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-16">
      <section className="card grid gap-6 p-10 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-600">
            MiniHackMe
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Learn cyber skills with focused, modern rooms.
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            A sleek learning platform inspired by TryHackMe. Read concise lessons,
            answer checks, and track your progress.
          </p>
          <div className="flex gap-4">
            <Link
              href="/modules"
              className="rounded-full bg-teal-600 px-6 py-2 text-sm font-semibold text-white"
            >
              Browse modules
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-border px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200"
            >
              Get started
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-slate-900 p-6 text-slate-100 shadow-inner">
          <h2 className="text-lg font-semibold">What you can do</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Read Markdown lessons with images and code blocks.</li>
            <li>• Complete checkpoints and track progress.</li>
            <li>• Admins can publish rooms and manage content.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Featured modules
          </h2>
          <Link href="/modules" className="text-sm text-teal-600">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </div>
  );
}
