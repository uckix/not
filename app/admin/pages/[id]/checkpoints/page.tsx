import { prisma } from "@/lib/prisma";
import { checkpointSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function CheckpointsAdminPage({
  params
}: {
  params: { id: string };
}) {
  const page = await prisma.lessonPage.findUnique({
    where: { id: params.id },
    include: { checkpoints: { orderBy: { orderIndex: "asc" } } }
  });

  if (!page) {
    return <div>Page not found.</div>;
  }

  async function addCheckpoint(formData: FormData) {
    "use server";
    await requireAdmin();
    const payload = {
      type: formData.get("type"),
      prompt: formData.get("prompt"),
      options: formData.get("options")
        ? (formData.get("options") as string).split("\n")
        : undefined,
      correctAnswer: formData.get("correctAnswer"),
      explanation: formData.get("explanation")
    };

    const parsed = checkpointSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid input");
    }

    await prisma.checkpoint.create({
      data: {
        lessonPageId: page.id,
        orderIndex: page.checkpoints.length + 1,
        type: parsed.data.type,
        prompt: parsed.data.prompt,
        options: parsed.data.options,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation ?? null
      }
    });

    redirect(`/admin/pages/${params.id}/checkpoints`);
  }

  async function updateCheckpoint(formData: FormData) {
    "use server";
    await requireAdmin();
    const checkpointId = formData.get("checkpointId") as string;
    const payload = {
      type: formData.get("type"),
      prompt: formData.get("prompt"),
      options: formData.get("options")
        ? (formData.get("options") as string).split("\n")
        : undefined,
      correctAnswer: formData.get("correctAnswer"),
      explanation: formData.get("explanation")
    };

    const parsed = checkpointSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error("Invalid input");
    }

    await prisma.checkpoint.update({
      where: { id: checkpointId },
      data: {
        type: parsed.data.type,
        prompt: parsed.data.prompt,
        options: parsed.data.options,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation ?? null
      }
    });

    redirect(`/admin/pages/${params.id}/checkpoints`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Checkpoints · {page.title}
      </h1>

      <form action={addCheckpoint} className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Add checkpoint</h2>
        <select
          name="type"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        >
          <option value="MULTIPLE_CHOICE">Multiple choice</option>
          <option value="TEXT">Text</option>
        </select>
        <input
          name="prompt"
          placeholder="Prompt"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <textarea
          name="options"
          placeholder="Options (one per line)"
          className="min-h-[120px] w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <input
          name="correctAnswer"
          placeholder="Correct answer"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <textarea
          name="explanation"
          placeholder="Explanation"
          className="min-h-[80px] w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
        />
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Add checkpoint
        </button>
      </form>

      <div className="space-y-4">
        {page.checkpoints.map((checkpoint) => (
          <form key={checkpoint.id} action={updateCheckpoint} className="card space-y-3 p-6">
            <input type="hidden" name="checkpointId" value={checkpoint.id} />
            <select
              name="type"
              defaultValue={checkpoint.type}
              className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
            >
              <option value="MULTIPLE_CHOICE">Multiple choice</option>
              <option value="TEXT">Text</option>
            </select>
            <input
              name="prompt"
              defaultValue={checkpoint.prompt}
              className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
            />
            <textarea
              name="options"
              defaultValue={(checkpoint.options as string[] | null)?.join("\n") ?? ""}
              className="min-h-[100px] w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
            />
            <input
              name="correctAnswer"
              defaultValue={checkpoint.correctAnswer}
              className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
            />
            <textarea
              name="explanation"
              defaultValue={checkpoint.explanation ?? ""}
              className="min-h-[80px] w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
            />
            <button className="rounded-lg border border-border px-4 py-2 text-sm">
              Update
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
