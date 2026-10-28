import { getProjectDetails } from "@/lib/projects";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activity } = await getProjectDetails(id);

  return (
    <ul className="max-w-2xl divide-y divide-amber-50">
      {activity.map((item) => (
        <li key={item.who + item.when} className="py-3">
          <p>
            <span className="font-medium">{item.who}</span> {item.what}
          </p>
          <p className="text-sm text-zinc-500">{item.when}</p>
        </li>
      ))}
    </ul>
  );
}
