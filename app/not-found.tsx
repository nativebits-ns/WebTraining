import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">We couldn't find that page</h1>
      <p className="mt-2 text-zinc-600">
        The link may be old, or the project may not exist.
      </p>
      <Link href="/projects" className="mt-4 inline-block text-teal-700 underline">
        Go to projects
      </Link>
    </div>
  );
}
