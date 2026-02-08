"use client";

import { useState } from "react";

export default function ImageUpload() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    const formData = new FormData(event.currentTarget);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }
    setResult(`![alt text](${data.url})`);
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-4">
      <h3 className="text-sm font-semibold">Upload image</h3>
      <input type="file" name="file" accept="image/*" className="text-xs" required />
      <button className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
        Upload
      </button>
      {result && (
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Markdown snippet:</p>
          <code className="block rounded bg-slate-100 p-2 text-xs dark:bg-slate-900">
            {result}
          </code>
        </div>
      )}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </form>
  );
}
