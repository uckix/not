"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push("/modules");
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={onSubmit} className="card space-y-4 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Log in
        </h1>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
        <button className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}
