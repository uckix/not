import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    include: { module: true }
  });

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {session.user.name ?? session.user.email}
        </h1>
        <p className="text-sm text-slate-500">{session.user.email}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Progress
        </h2>
        {progress.length === 0 ? (
          <p className="text-sm text-slate-500">No progress yet.</p>
        ) : (
          <div className="grid gap-4">
            {progress.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.module.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {item.completedPages} pages · {item.completedCheckpoints} checkpoints
                    </p>
                  </div>
                  <Link
                    href={`/modules/${item.module.slug}`}
                    className="text-sm text-teal-600"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
