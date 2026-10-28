import Link from "next/link";
import { getProjects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export default async function Home() {
  const projects = await getProjects();
  const inProgress = projects.filter((p) => p.status === "active").slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Find out where every project stands
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          Project Explorer is the one place to check who is on a project, what is
          still open and what changed this week.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/projects"
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white"
          >
            Browse projects
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium"
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Being worked on right now</h2>
          <Link
            href="/projects?status=active"
            className="text-sm text-teal-700 hover:underline"
          >
            See all active projects
          </Link>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {inProgress.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      </section>
    </div>
  );
}
