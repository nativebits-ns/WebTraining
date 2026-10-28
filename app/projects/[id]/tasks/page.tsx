import { getProjectDetails, type Task } from "@/lib/projects";

const columns: { state: Task["state"]; title: string }[] = [
  { state: "todo", title: "To do" },
  { state: "in-progress", title: "In progress" },
  { state: "done", title: "Done" },
];

export default async function TasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tasks } = await getProjectDetails(id);

  return (
    <div className="grid gap-4 grid-cols-3">
      {columns.map((col) => {
        const items = tasks.filter((t) => t.state === col.state);
        return (
          <section key={col.state}>
            <h2 className="mb-2 font-medium">
              {col.title} <span className="text-zinc-500">({items.length})</span>
            </h2>
            {items.length === 0 ? (
              <p className="text-sm text-zinc-500">Nothing here.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((task) => (
                  <li key={task.id} className="rounded-lg border border-zinc-200 p-3 text-sm">
                    <p>{task.title}</p>
                    <p className="mt-1 text-zinc-500">{task.assignee}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
