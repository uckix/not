import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  async function updateRole(formData: FormData) {
    "use server";
    await requireAdmin();
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as "USER" | "ADMIN";

    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    redirect("/admin/users");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Users
      </h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user.username}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <form action={updateRole} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <select
                name="role"
                defaultValue={user.role}
                className="rounded-lg border border-border bg-white/80 px-2 py-1 text-xs dark:bg-slate-900"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button className="rounded-lg border border-border px-2 py-1 text-xs">
                Update
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
