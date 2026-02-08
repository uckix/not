import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Markdown from "@/components/markdown";
import CheckpointsPanel from "@/components/checkpoints-panel";
import ScrollComplete from "@/components/scroll-complete";

export default async function LearnPage({
  params
}: {
  params: { slug: string; page: string };
}) {
  const module = await prisma.module.findUnique({
    where: { slug: params.slug },
    include: {
      pages: {
        orderBy: { orderIndex: "asc" },
        include: { checkpoints: { orderBy: { orderIndex: "asc" } } }
      }
    }
  });

  if (!module || !module.published) {
    return <div>Module not found.</div>;
  }

  const pageIndex = Number(params.page);
  const page = module.pages.find((item) => item.orderIndex === pageIndex);

  if (!page) {
    return <div>Lesson not found.</div>;
  }

  const currentIndex = module.pages.findIndex((item) => item.id === page.id);
  const prev = module.pages[currentIndex - 1];
  const next = module.pages[currentIndex + 1];

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="card p-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {page.title}
          </h1>
          <div className="mt-6">
            <Markdown content={page.markdownContent} />
          </div>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          {prev ? (
            <Link href={`/learn/${module.slug}/${prev.orderIndex}`}>← Previous</Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/learn/${module.slug}/${next.orderIndex}`}>Next →</Link>
          ) : (
            <span />
          )}
        </div>
      </div>
      <aside className="space-y-4">
        <div className="card p-4">
          <h2 className="text-lg font-semibold">Progress</h2>
          <p className="text-sm text-slate-500">
            Page {page.orderIndex} of {module.pages.length}
          </p>
        </div>
        <CheckpointsPanel
          checkpoints={page.checkpoints.map((checkpoint) => ({
            id: checkpoint.id,
            type: checkpoint.type,
            prompt: checkpoint.prompt,
            options: checkpoint.options as string[] | null,
            explanation: checkpoint.explanation
          }))}
          pageId={page.id}
        />
        <ScrollComplete pageId={page.id} />
      </aside>
    </div>
  );
}
