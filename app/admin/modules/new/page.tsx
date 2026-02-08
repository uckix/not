import { prisma } from "@/lib/prisma";
import { moduleSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default function NewModulePage() {
  async function createModule(formData: FormData) {
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

    const admin = await requireAdmin();

    await prisma.module.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        difficulty: parsed.data.difficulty,
        tags: parsed.data.tags ? parsed.data.tags.split(",").map((tag) => tag.trim()) : [],
        coverImage: parsed.data.coverImage || null,
        createdById: admin.id
      }
    });

    redirect("/admin/modules");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Create module
      </h1>
      <form action={createModule} className="card space-y-4 p-6">
        <input
          name="title"
          placeholder="Title"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <input
          name="slug"
          placeholder="Slug (unique)"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <select
          name="difficulty"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <input
          name="coverImage"
          placeholder="Cover image URL"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Create
        </button>
      </form>
    </div>
  );
}
