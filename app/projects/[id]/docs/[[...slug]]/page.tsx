import Link from "next/link";
import type { Metadata } from "next";
import { getProjectBasic } from "@/lib/projects";

type Props = { params: Promise<{ id: string; slug?: string[] }> };

type Doc = { title: string; body: (project: string) => string[] };

const docs: Record<string, Doc> = {
  "": {
    title: "Documentation",
    body: (p) => [
      `Everything you need to work on ${p}. Pick a guide below, or type a path into the URL to see how nested docs are handled.`,
    ],
  },
  setup: {
    title: "Setup",
    body: (p) => [
      `Clone the ${p} repository, install dependencies with npm install, and copy .env.example to .env.local.`,
      "Run npm run dev and open http://localhost:3000 to check that everything starts.",
    ],
  },
  "setup/database": {
    title: "Database setup",
    body: () => [
      "We use Postgres 16. The quickest way to get one locally is the docker compose file in the repo root.",
      "Run the migrations once the container is up, then seed the sample data so you have something to look at.",
    ],
  },
  "setup/environment": {
    title: "Environment variables",
    body: () => [
      "DATABASE_URL points at your local Postgres. API_BASE_URL is the staging API.",
      "Never commit .env.local. Ask in the team channel if you need the staging keys.",
    ],
  },
  deploy: {
    title: "Deploying",
    body: (p) => [
      `Merging to main deploys ${p} to staging automatically. Production releases are tagged by the project owner.`,
    ],
  },
};

function cleanSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, slug = [] } = await params;
  const doc = docs[slug.join("/")];
  return { title: `${doc?.title ?? "Docs"} | ${getProjectBasic(id).name}` };
}

export default async function DocsPage({ params }: Props) {
  const { id, slug = [] } = await params;
  const project = getProjectBasic(id);
  const segments = slug.map(cleanSegment);
  const key = slug.join("/");
  const doc = docs[key];
  const fullPath = ["/projects", id, "docs", ...segments].join("/");

  return (
    <div className="max-w-2xl space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1 text-sm text-zinc-500">
        <Link href={`/projects/${id}/docs`} className="text-teal-700 hover:underline">
          docs
        </Link>
        {segments.map((segment, i) => (
          <span key={i} className="flex gap-1">
            <span aria-hidden="true">/</span>
            {i < segments.length - 1 ? (
              <Link
                href={`/projects/${id}/docs/${slug.slice(0, i + 1).join("/")}`}
                className="text-teal-700 hover:underline"
              >
                {segment}
              </Link>
            ) : (
              <span>{segment}</span>
            )}
          </span>
        ))}
      </nav>

      <p className="text-sm text-zinc-500">
        Requested path:{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono">{fullPath}</code>
      </p>

      {doc ? (
        <article className="space-y-3">
          <h2 className="text-2xl font-semibold">{doc.title}</h2>
          {doc.body(project.name).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      ) : (
        <article className="rounded-lg border border-dashed border-zinc-300 p-5">
          <h2 className="text-lg font-semibold">No page here yet</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Nobody has written <strong>{segments.join(" / ")}</strong> for {project.name}.
            Check the guides below, or ask the project owner, {project.owner}.
          </p>
        </article>
      )}

      {key === "" || !doc ? (
        <ul className="list-disc space-y-1 pl-5">
          {[
            ["setup", "Setup"],
            ["setup/database", "Database setup"],
            ["setup/environment", "Environment variables"],
            ["deploy", "Deploying"],
          ].map(([path, label]) => (
            <li key={path}>
              <Link href={`/projects/${id}/docs/${path}`} className="text-teal-700 hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
