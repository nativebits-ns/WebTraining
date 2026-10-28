import { Bar } from "@/components/Skeleton";

export default function ProjectLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <p className="text-sm text-zinc-500">Loading project details…</p>
      <Bar className="h-4 w-full max-w-xl" />
      <Bar className="h-4 w-full max-w-lg" />
      <Bar className="h-4 w-2/3 max-w-md" />
      <div className="grid gap-3 pt-2 grid-cols-3">
        <Bar className="h-20" />
        <Bar className="h-20" />
        <Bar className="h-20" />
      </div>
    </div>
  );
}
