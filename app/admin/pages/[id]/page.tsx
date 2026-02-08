import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { lessonPageSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";
import MarkdownEditor from "@/components/markdown-editor";
import ImageUpload from "@/components/image-upload";

export default async function EditLessonPage({
  params
}: {
  params: { id: string };
}) {
  const page = await prisma.lessonPage.findUnique({
    where: { id: params.id }
  });

  if (!page) {
    return <div>Page not found.</div>;
  }

  async function savePage(formData: FormData) {
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

    await prisma.lessonPage.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title,
        markdownContent: parsed.data.markdownContent
      }
    });

    redirect(`/admin/pages/${params.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Edit lesson
        </h1>
        <Link href={`/admin/pages/${params.id}/checkpoints`} className="text-sm text-teal-600">
          Manage checkpoints →
        </Link>
      </div>
      <form action={savePage} className="space-y-4">
        <input
          name="title"
          defaultValue={page.title}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <MarkdownEditor initialContent={page.markdownContent} name="markdownContent" />
        <ImageUpload />
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Save page
        </button>
      </form>
    </div>
  );
}
