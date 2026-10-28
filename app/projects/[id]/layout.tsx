import { Suspense } from "react";
import { getProjectBasic } from "@/lib/projects";
import StatusBadge from "@/components/StatusBadge";
import FavoriteButton from "@/components/FavoriteButton";
import ProjectTabs from "@/components/ProjectTabs";
import BackLink from "@/components/BackLink";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectBasic(id);

  return (
    <div className="space-y-6">
      <div>
        <Suspense>
          <BackLink />
        </Suspense>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <StatusBadge status={project.status} />
          <FavoriteButton id={project.id} name={project.name} />
        </div>
        <p className="mt-1 text-zinc-600">Owner: {project.owner}</p>
      </div>

      <Suspense fallback={<div className="h-10 border-b border-zinc-200" />}>
        <ProjectTabs id={project.id} />
      </Suspense>

      {children}
    </div>
  );
}
