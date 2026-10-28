"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ProjectError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-900">
        We couldn't load this project
      </h2>
      <p className="mt-1 text-sm text-red-800">
        Something went wrong while fetching the project data. It's usually
        temporary. The rest of the app still works, and you can try again.
      </p>
      <button
        type="button"
        onClick={retry}
        disabled={isPending}
        className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isPending ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
