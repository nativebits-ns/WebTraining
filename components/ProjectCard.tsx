import Link from "next/link";
import { formatDate, type Project } from "@/lib/projects";
import StatusBadge from "./StatusBadge";
import FavoriteButton from "./FavoriteButton";

// `from` is the filter query string the user came from, so the project pages
// can send them back to the same filtered list.
export default function ProjectCard({
  project,
  from = "",
}: {
  project: Project;
  from?: string;
}) {
  const href = from
    ? `/projects/${project.id}?${new URLSearchParams({ from })}`
    : `/projects/${project.id}`;

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">
          <Link href={href} className="hover:underline">
            {project.name}
          </Link>
        </h3>
        <FavoriteButton id={project.id} name={project.name} />
      </div>
      <p className="mt-1 text-sm text-zinc-600">
        {project.summary}
      </p>
      <div className="mt-3 flex items-center gap-3 text-sm">
        <StatusBadge status={project.status} />
        <span className="text-zinc-500">{project.progress}% done</span>
        <span className="text-zinc-500">Due {formatDate(project.dueDate)}</span>
      </div>
    </li>
  );
}
