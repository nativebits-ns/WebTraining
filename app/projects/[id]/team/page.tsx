import { getProjectDetails } from "@/lib/projects";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { team } = await getProjectDetails(id);

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {team.map((m) => (
        <li key={m.name} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-800"
          >
            {m.name.split(" ").map((w) => w[0]).join("")}
          </span>
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-sm text-zinc-500">{m.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
