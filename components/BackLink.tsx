"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BackLink() {
  const from = useSearchParams().get("from");
  return (
    <Link
      href={from ? `/projects?${from}` : "/projects"}
      className="text-sm text-teal-700 hover:underline"
    >
      ← Back to projects
    </Link>
  );
}
