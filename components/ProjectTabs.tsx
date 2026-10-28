"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const tabs = [
  { slug: "", label: "Overview" },
  { slug: "team", label: "Team" },
  { slug: "tasks", label: "Tasks" },
  { slug: "activity", label: "Activity" },
  { slug: "docs", label: "Docs" },
];

export default function ProjectTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const from = useSearchParams().get("from");
  const base = `/projects/${id}`;
  const suffix = from ? `?${new URLSearchParams({ from })}` : "";

  return (
    <nav aria-label="Project sections" className="flex gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const href = tab.slug ? `${base}/${tab.slug}` : base;
        const active = tab.slug
          ? pathname === href || pathname.startsWith(href + "/")
          : pathname === base;
        return (
          <Link
            key={tab.label}
            href={href + suffix}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${
              active
                ? "border-teal-700 font-medium text-teal-800"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
