import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import FavoritesView from "@/components/FavoritesView";

export const metadata: Metadata = { title: "Favorites" };

export default async function FavoritesPage() {
  const projects = await getProjects();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Favorites</h1>
      <FavoritesView projects={projects} />
    </div>
  );
}
