import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moduleSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function EditModulePage({
  params
}: {
  params: { id: string };
}) {
  const module = await prisma.module.findUnique({
    where: { id: params.id }
  });

  if (!module) {
    return <div>Module not found.</div>;
  }

  async function updateModule(formData: FormData) {
    "use server";
    await requireAdmin();
    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      difficulty: formData.get("difficulty"),
      tags: formData.get("tags"),
      coverImage: formData.get("coverImage")
    };

    const parsed = moduleSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid input");
    }

    await prisma.module.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        difficulty: parsed.data.difficulty,
        tags: parsed.data.tags ? parsed.data.tags.split(",").map((tag) => tag.trim()) : [],
        coverImage: parsed.data.coverImage || null,
        published: formData.get("published") === "on"
      }
    });

    redirect(`/admin/modules/${params.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Edit module
        </h1>
        <Link href={`/admin/modules/${params.id}/pages`} className="text-sm text-teal-600">
          Manage pages →
        </Link>
      </div>
      <form action={updateModule} className="card space-y-4 p-6">
        <input
          name="title"
          defaultValue={module.title}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <input
          name="slug"
          defaultValue={module.slug}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <textarea
          name="description"
          defaultValue={module.description}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <select
          name="difficulty"
          defaultValue={module.difficulty}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <input
          name="tags"
          defaultValue={module.tags.join(", ")}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <input
          name="coverImage"
          defaultValue={module.coverImage ?? ""}
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="published" defaultChecked={module.published} />
          Published
        </label>
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Save changes
        </button>
      </form>
    </div>
  );
}
