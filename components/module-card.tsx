import Link from "next/link";
type ModuleSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
};

export default function ModuleCard({
  module,
  progress
}: {
  module: ModuleSummary;
  progress?: number;
}) {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-slate-500">
          {module.difficulty}
        </span>
        <span className="text-xs text-slate-500">{module.tags.join(", ")}</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {module.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {module.description}
        </p>
      </div>
      {typeof progress === "number" && (
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-teal-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{progress}% complete</p>
        </div>
      )}
      <Link
        href={`/modules/${module.slug}`}
        className="text-sm font-medium text-teal-600 hover:text-teal-500"
      >
        View module →
      </Link>
    </div>
  );
}
