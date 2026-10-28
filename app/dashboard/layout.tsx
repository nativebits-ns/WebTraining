import { getProjects } from "@/lib/projects";
import NavLink from "@/components/NavLink";

const linkClass =
  "block rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100";
const activeClass =
  "bg-teal-50! text-teal-800! font-medium";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects();
  const active = projects.filter((p) => p.status === "active");

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <nav aria-label="Dashboard" className="space-y-6">
          <div>
            <NavLink href="/dashboard" exact className={linkClass} activeClassName={activeClass}>
              Overview
            </NavLink>
            <NavLink href="/dashboard/favorites" className={linkClass} activeClassName={activeClass}>
              Favorites
            </NavLink>
          </div>
          <div>
            <p className="px-3 pb-1 text-sm font-medium">Active projects</p>
            {active.map((p) => (
              <NavLink
                key={p.id}
                href={`/projects/${p.id}`}
                className={linkClass}
                activeClassName={activeClass}
              >
                {p.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
