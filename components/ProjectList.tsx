"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { useFavorites } from "@/lib/favorites";
import ProjectCard from "./ProjectCard";

type SortKey = "name" | "progress" | "due" | "favorites";

export default function ProjectList({
  projects,
  from,
}: {
  projects: Project[];
  from: string;
}) {
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const { ids } = useFavorites();

  const sorted = useMemo(() => {
    const copy = [...projects];
    copy.sort((a, b) => {
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "due") return a.dueDate.localeCompare(b.dueDate);
      if (sortBy === "favorites") {
        const diff = Number(ids.includes(b.id)) - Number(ids.includes(a.id));
        if (diff !== 0) return diff;
      }
      return a.name.localeCompare(b.name);
    });
    return copy;
  }, [projects, sortBy, ids]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <p className="text-zinc-600 dark:text-zinc-400">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
        <label className="flex items-center gap-2">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1"
          >
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="due">Due date</option>
            <option value="favorites">Favorites first</option>
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-600">
          No projects match those filters. Try a different search or clear the filters.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} from={from} />
          ))}
        </ul>
      )}
    </div>
  );
}
