"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { useFavorites } from "@/lib/favorites";
import ProjectCard from "./ProjectCard";

export default function FavoritesView({ projects }: { projects: Project[] }) {
  const { ids } = useFavorites();
  const favorites = projects.filter((p) => ids.includes(p.id));

  if (favorites.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-zinc-600">
        Nothing starred yet. Open the{" "}
        <Link href="/projects" className="text-teal-700 underline">
          projects list
        </Link>{" "}
        and click the star on anything you want to keep an eye on.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 grid-cols-2">
      {favorites.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
