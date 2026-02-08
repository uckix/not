"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password")
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Unable to register.");
      return;
    }

    setSuccess(true);
    router.push("/auth/login");
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={onSubmit} className="card space-y-4 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Create your account
        </h1>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">Account created!</p>}
        <input
          name="username"
          placeholder="Username"
          className="w-full rounded-lg border border-border bg-white/80 px-4 py-2 text-sm dark:bg-slate-900"
          required
        />
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
          Sign up
        </button>
      </form>
    </div>
  );
}
