import Link from "next/link";
import { getRecentActivity } from "@/lib/projects";

// Async server component. It takes about two seconds on purpose.
export default async function RecentActivity() {
  const items = await getRecentActivity();

  return (
    <section className="rounded-lg border border-zinc-200 p-4">
      <h2 className="font-semibold">Recent activity</h2>
      <ul className="mt-3 divide-y divide-zinc-100 text-sm">
        {items.map((item) => (
          <li key={item.project + item.when} className="py-2">
            <span className="font-medium">{item.who}</span> {item.what} in{" "}
            <Link
              href={`/projects/${item.projectId}`}
              className="text-teal-700 hover:underline"
            >
              {item.project}
            </Link>
            <span className="block text-zinc-500">{item.when}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
