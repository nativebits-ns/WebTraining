"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const statusOptions = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On hold" },
];

export default function ProjectFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState(searchParams.get("search") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currentStatus = searchParams.get("status") ?? "";

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  }

  function onSearchChange(value: string) {
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => updateParam("search", value.trim()), 300);
  }

  function clearAll() {
    setText("");
    startTransition(() => router.replace(pathname));
  }

  const hasFilters = text !== "" || currentStatus !== "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        value={text}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name, tag or description"
        aria-label="Search projects"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm sm:max-w-xs"
      />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateParam("status", option.value)}
            aria-pressed={currentStatus === option.value}
            className={`rounded-full border px-3 py-1 text-sm ${
              currentStatus === option.value
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-zinc-300 hover:bg-zinc-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-teal-700 underline"
        >
          Clear filters
        </button>
      )}
      {isPending && <span className="text-sm text-zinc-500">Updating…</span>}
    </div>
  );
}
