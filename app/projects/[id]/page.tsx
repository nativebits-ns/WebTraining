import type { Metadata } from "next";
import { formatDate, getProjectBasic, getProjectDetails } from "@/lib/projects";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: getProjectBasic(id).name };
}

export default async function ProjectOverview({ params }: Props) {
  const { id } = await params;
  const project = await getProjectDetails(id);
  const done = project.tasks.filter((t) => t.state === "done").length;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl">{project.description}</p>

      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div
          className="h-2 max-w-md overflow-hidden rounded-full bg-zinc-200"
          role="progressbar"
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-teal-700" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <dl className="grid max-w-2xl gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-3">
          <dt className="text-zinc-500">Due date</dt>
          <dd className="font-medium">{formatDate(project.dueDate)}</dd>
        </div>
        <div className="rounded-lg border border-zinc-200 p-3">
          <dt className="text-zinc-500">Tasks finished</dt>
          <dd className="font-medium">
            {done} of {project.tasks.length}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-200 p-3">
          <dt className="text-zinc-500">People</dt>
          <dd className="font-medium">{project.team.length}</dd>
        </div>
      </dl>

      <p className="text-sm text-zinc-600">
        Tags: {project.tags.join(", ")}
      </p>
    </div>
  );
}
