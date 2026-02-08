"use client";

import { useState } from "react";

type Checkpoint = {
  id: string;
  type: "MULTIPLE_CHOICE" | "TEXT";
  prompt: string;
  options: string[] | null;
  explanation: string | null;
};

export default function CheckpointsPanel({
  checkpoints,
  pageId
}: {
  checkpoints: Checkpoint[];
  pageId: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (checkpointId: string) => {
    setMessage(null);
    const res = await fetch("/api/checkpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkpointId, answer: answers[checkpointId] })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Unable to submit answer.");
      return;
    }
    setStatus((prev) => ({ ...prev, [checkpointId]: data.isCorrect }));
    if (data.isCorrect) {
      setMessage("Checkpoint complete!");
    } else {
      setMessage("Try again.");
    }
  };

  const markComplete = async () => {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Unable to mark complete.");
      return;
    }
    setMessage("Page marked complete.");
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-lg font-semibold">Checkpoints</h3>
        {checkpoints.length === 0 ? (
          <p className="text-sm text-slate-500">No checkpoints on this page.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {checkpoints.map((checkpoint) => (
              <div key={checkpoint.id} className="space-y-2">
                <p className="text-sm font-medium">{checkpoint.prompt}</p>
                {checkpoint.type === "MULTIPLE_CHOICE" && checkpoint.options ? (
                  <select
                    className="w-full rounded-lg border border-border bg-white/80 p-2 text-sm dark:bg-slate-900"
                    value={answers[checkpoint.id] ?? ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [checkpoint.id]: event.target.value
                      }))
                    }
                  >
                    <option value="">Choose an answer</option>
                    {checkpoint.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full rounded-lg border border-border bg-white/80 p-2 text-sm dark:bg-slate-900"
                    value={answers[checkpoint.id] ?? ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [checkpoint.id]: event.target.value
                      }))
                    }
                  />
                )}
                <button
                  className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-semibold text-white"
                  onClick={() => submit(checkpoint.id)}
                >
                  Submit
                </button>
                {status[checkpoint.id] !== undefined && (
                  <p
                    className={`text-xs ${
                      status[checkpoint.id]
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {status[checkpoint.id] ? "Correct" : "Incorrect"}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className="w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
        onClick={markComplete}
      >
        Mark as complete
      </button>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  );
}
