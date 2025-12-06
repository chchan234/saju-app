"use client";

import { useEffect, useState } from "react";

interface ViewCountProps {
  className?: string;
}

export function ViewCount({ className }: ViewCountProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/saju/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  const defaultClass = "inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 bg-muted/50 px-3 py-1.5 rounded-full";

  return (
    <span className={className || defaultClass}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      {count.toLocaleString()}회 분석 완료
    </span>
  );
}
