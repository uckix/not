import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function ModulePagesPage({
  params
}: {
  params: { id: string };
}) {
  const module = await prisma.module.findUnique({
    where: { id: params.id },
    include: { pages: { orderBy: { orderIndex: "asc" } } }
  });

  if (!module) {
    return <div>Module not found.</div>;
  }

  async function movePage(formData: FormData) {
    "use server";
    await requireAdmin();
    const pageId = formData.get("pageId") as string;
    const direction = formData.get("direction") as string;

    const page = await prisma.lessonPage.findUnique({ where: { id: pageId } });
    if (!page) return;

    const swapWith = await prisma.lessonPage.findFirst({
      where: {
        moduleId: module.id,
        orderIndex: direction === "up" ? page.orderIndex - 1 : page.orderIndex + 1
      }
    });
    if (!swapWith) return;

    await prisma.$transaction([
      prisma.lessonPage.update({
        where: { id: page.id },
        data: { orderIndex: swapWith.orderIndex }
      }),
      prisma.lessonPage.update({
        where: { id: swapWith.id },
        data: { orderIndex: page.orderIndex }
      })
    ]);

    redirect(`/admin/modules/${params.id}/pages`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Pages · {module.title}
        </h1>
        <Link href={`/admin/pages/new?moduleId=${module.id}`} className="text-sm text-teal-600">
          Add page →
        </Link>
      </div>

      <div className="space-y-4">
        {module.pages.map((page) => (
          <div key={page.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-slate-500">Lesson {page.orderIndex}</p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {page.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <form action={movePage}>
                <input type="hidden" name="pageId" value={page.id} />
                <input type="hidden" name="direction" value="up" />
                <button className="rounded-lg border border-border px-3 py-1 text-xs">
                  Up
                </button>
              </form>
              <form action={movePage}>
                <input type="hidden" name="pageId" value={page.id} />
                <input type="hidden" name="direction" value="down" />
                <button className="rounded-lg border border-border px-3 py-1 text-xs">
                  Down
                </button>
              </form>
              <Link href={`/admin/pages/${page.id}`} className="text-sm text-teal-600">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
