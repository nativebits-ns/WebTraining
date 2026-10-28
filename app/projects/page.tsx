import { Suspense } from "react";
import type { Metadata } from "next";
import { filterProjects, isStatus } from "@/lib/projects";
import ProjectFilters from "@/components/ProjectFilters";
import ProjectList from "@/components/ProjectList";

export const metadata: Metadata = { title: "Projects" };

type SearchParams = Promise<{
  search?: string | string[];
  status?: string | string[];
}>;

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = first(params.search)?.trim() || undefined;
  const rawStatus = first(params.status);
  const status = isStatus(rawStatus) ? rawStatus : undefined;

  const results = filterProjects(search, status);

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (status) query.set("status", status);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Projects</h1>

      <Suspense fallback={<div className="h-10" />}>
        <ProjectFilters />
      </Suspense>

      <ProjectList projects={results} from={query.toString()} />
    </div>
  );
}
