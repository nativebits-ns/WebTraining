import { getAllTeamMembers } from "@/lib/projects";

// Even slower than recent activity, so the two sections pop in separately.
export default async function TeamMembers() {
  const members = await getAllTeamMembers();

  return (
    <section className="rounded-lg border border-zinc-200 p-4">
      <h2 className="font-semibold">Team members</h2>
      <ul className="mt-3 divide-y divide-zinc-100 text-sm">
        {members.map((m) => (
          <li key={m.name} className="flex items-center justify-between py-2">
            <span>
              <span className="font-medium">{m.name}</span>
              <span className="block text-zinc-500">{m.role}</span>
            </span>
            <span className="text-zinc-500">
              {m.projectCount} {m.projectCount === 1 ? "project" : "projects"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
