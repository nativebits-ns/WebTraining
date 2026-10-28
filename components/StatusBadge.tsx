import type { Status } from "@/lib/projects";

const styles: Record<Status, string> = {
  active:
    "bg-emerald-100 text-emerald-800",
  completed: "bg-sky-100 text-sky-800",
  "on-hold": "bg-amber-100 text-amber-800",
};

const labels: Record<Status, string> = {
  active: "Active",
  completed: "Completed",
  "on-hold": "On hold",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
