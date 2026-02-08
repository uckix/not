import { prisma } from "@/lib/prisma";
import { lessonPageSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function NewLessonPage({
  searchParams
}: {
  searchParams?: { moduleId?: string };
}) {
  const moduleId = searchParams?.moduleId;
  if (!moduleId) {
    return <div>Module ID required.</div>;
  }

  async function createPage(formData: FormData) {
    "use server";
    await requireAdmin();
    const payload = {
      title: formData.get("title"),
      markdownContent: formData.get("markdownContent")
    };

    const parsed = lessonPageSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid input");
    }

    const count = await prisma.lessonPage.count({ where: { moduleId } });

    await prisma.lessonPage.create({
      data: {
        moduleId,
        orderIndex: count + 1,
        title: parsed.data.title,
        markdownContent: parsed.data.markdownContent
      }
    });

    redirect(`/admin/modules/${moduleId}/pages`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        New lesson page
      </h1>
      <form action={createPage} className="card space-y-4 p-6">
        <input
          name="title"
          placeholder="Title"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <textarea
          name="markdownContent"
          placeholder="Markdown content"
          className="min-h-[220px] w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Create page
        </button>
      </form>
    </div>
  );
}
