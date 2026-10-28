export function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-200 ${className}`}
    />
  );
}

export function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="space-y-3 rounded-lg border border-zinc-200 p-4"
      aria-busy="true"
    >
      <Bar className="h-5 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <Bar key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
