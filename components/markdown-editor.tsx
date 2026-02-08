"use client";

import { useState } from "react";
import Markdown from "@/components/markdown";

export default function MarkdownEditor({
  initialContent,
  name
}: {
  initialContent: string;
  name: string;
}) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <textarea
        name={name}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-[400px] w-full rounded-lg border border-border bg-white/80 p-4 text-sm dark:bg-slate-900"
      />
      <div className="card p-4">
        <Markdown content={content} />
      </div>
    </div>
  );
}
