import { Suspense } from "react";
import type { Metadata } from "next";
import { formatDate, getProjects } from "@/lib/projects";
import RecentActivity from "@/components/RecentActivity";
import TeamMembers from "@/components/TeamMembers";
import { CardSkeleton } from "@/components/Skeleton";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const projects = await getProjects();
  const count = (s: string) => projects.filter((p) => p.status === s).length;
  const nextDue = projects
    .filter((p) => p.status === "active")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  const stats = [
    { label: "Active", value: count("active") },
    { label: "Completed", value: count("completed") },
    { label: "On hold", value: count("on-hold") },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <section className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-zinc-200 p-4">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="text-sm text-zinc-600">{s.label} projects</p>
          </div>
        ))}
      </section>

      {nextDue && (
        <p className="text-sm text-zinc-600">
          Next deadline:{" "}
          <Link href={`/projects/${nextDue.id}`} className="font-bold hover:underline">
            {nextDue.name}
          </Link>{" "}
          on {formatDate(nextDue.dueDate)}.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<CardSkeleton rows={5} />}>
          <RecentActivity />
        </Suspense>
        <Suspense fallback={<CardSkeleton rows={6} />}>
          <TeamMembers />
        </Suspense>
      </div>
    </div>
  );
}
