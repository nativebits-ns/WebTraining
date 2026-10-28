import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

const rows = [
  {
    title: "Appearance",
    text: "The app follows your operating system's light or dark setting.",
  },
  {
    title: "Favorites",
    text: "Starred projects are saved in this browser only.",
  },
  {
    title: "Data source",
    text: "Projects, people and tasks come from demo data in lib/projects.ts.",
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <dl className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {rows.map((row) => (
          <div key={row.title} className="p-4">
            <dt className="font-medium">{row.title}</dt>
            <dd className="mt-1 text-sm text-zinc-600">{row.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
