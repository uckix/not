"use client";

import { useEffect, useState } from "react";

export default function ScrollComplete({ pageId }: { pageId: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;

    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (nearBottom) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId })
        }).then((res) => {
          if (res.ok) {
            setDone(true);
          }
        });
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [done, pageId]);

  return null;
}
