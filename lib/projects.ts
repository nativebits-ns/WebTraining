import { cache } from "react";
import { notFound } from "next/navigation";

export type Status = "active" | "completed" | "on-hold";

export const STATUSES: Status[] = ["active", "completed", "on-hold"];

export type Project = {
  id: string;
  name: string;
  summary: string;
  status: Status;
  owner: string;
  progress: number;
  dueDate: string; // ISO date
  tags: string[];
};

export type Member = { name: string; role: string };

export type Task = {
  id: string;
  title: string;
  assignee: string;
  state: "todo" | "in-progress" | "done";
};

export type ActivityItem = { who: string; what: string; when: string };

export type ProjectDetails = Project & {
  description: string;
  team: Member[];
  tasks: Task[];
  activity: ActivityItem[];
};

const people: Record<string, Member> = {
  nachiket: { name: "Nachiket Shilwant", role: "Engineering lead" },
  nachiket1: { name: "Nachiket Shilwant", role: "Product designer" },
  nachiket2: { name: "Nachiket Shilwant", role: "Frontend developer" },
  nachiket3: { name: "Nachiket Shilwant", role: "Backend developer" },
  nachiket4: { name: "Nachiket Shilwant", role: "QA engineer" },
  nachiket5: { name: "Nachiket Shilwant", role: "Project manager" },
};

const projects: Project[] = [
  {
    id: "1",
    name: "Customer Portal Revamp",
    summary:
      "Rebuild the customer-facing portal on Next.js so invoices, tickets and account settings load fast on slow connections.",
    status: "active",
    owner: "Nachiket Shilwant",
    progress: 68,
    dueDate: "2026-12-18",
    tags: ["nextjs", "frontend", "customer"],
  },
  {
    id: "2",
    name: "Mobile Banking App",
    summary:
      "Native iOS and Android app for balance checks, transfers and card controls. Shipped to all branches in September.",
    status: "completed",
    owner: "Nachiket Shilwant",
    progress: 100,
    dueDate: "2026-09-12",
    tags: ["mobile", "ios", "android"],
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    summary:
      "A shared dashboard that pulls sales and support numbers into one place so managers stop asking for spreadsheets.",
    status: "active",
    owner: "Nachiket Shilwant",
    progress: 45,
    dueDate: "2027-01-30",
    tags: ["dashboard", "data", "nextjs"],
  },
  {
    id: "4",
    name: "Internal Wiki Migration",
    summary:
      "Move the old Confluence pages into the new docs site. Paused until the content owners finish their review.",
    status: "on-hold",
    owner: "Nachiket Shilwant",
    progress: 30,
    dueDate: "2027-03-05",
    tags: ["docs", "migration"],
  },
  {
    id: "5",
    name: "Billing Service Rewrite",
    summary:
      "Replace the legacy billing cron jobs with an event-driven service that can retry failed charges on its own.",
    status: "active",
    owner: "Nachiket Shilwant",
    progress: 80,
    dueDate: "2026-11-20",
    tags: ["backend", "billing", "api"],
  },
  {
    id: "6",
    name: "Invoice Sync Service",
    summary:
      "Keeps invoices in sync between the billing service and the accounting system. Depends on a flaky vendor API.",
    status: "active",
    owner: "Nachiket Shilwant",
    progress: 52,
    dueDate: "2027-02-14",
    tags: ["backend", "integration", "billing"],
  },
];

const detailsById: Record<
  string,
  {
    description: string;
    team: (keyof typeof people)[];
    tasks: [string, keyof typeof people, Task["state"]][];
    activity: ActivityItem[];
  }
> = {
  "1": {
    description:
      "The current portal is a server-rendered PHP app that takes four seconds to show the first invoice. We're rebuilding it page by page, starting with invoices and tickets, and running both versions side by side until the new one covers everything.",
    team: ["nachiket1", "nachiket2", "nachiket3", "nachiket4"],
    tasks: [
      ["Port invoice list to the new app", "nachiket1", "done"],
      ["Design the ticket detail screen", "nachiket2", "done"],
      ["Single sign-on with the old session cookie", "nachiket3", "in-progress"],
      ["Regression pass on the payment flow", "nachiket4", "todo"],
      ["Write the cutover checklist", "nachiket", "todo"],
    ],
    activity: [
      { who: "Nachiket Shilwant", what: "merged the invoice list into main", when: "2 hours ago" },
      { who: "Nachiket Shilwant", what: "reported a layout bug on small phones", when: "Yesterday" },
      { who: "Nachiket Shilwant", what: "uploaded final ticket screens", when: "3 days ago" },
    ],
  },
  "2": {
    description:
      "Customers can check balances, send transfers and freeze a lost card from their phone. The app went live in September after two rounds of beta testing with branch staff.",
    team: ["nachiket", "nachiket1", "nachiket3"],
    tasks: [
      ["Card freeze flow", "nachiket", "done"],
      ["Accessibility audit", "nachiket1", "done"],
      ["Store listing screenshots", "nachiket3", "done"],
    ],
    activity: [
      { who: "Nachiket Shilwant", what: "closed the release milestone", when: "6 weeks ago" },
      { who: "Nachiket Shilwant", what: "signed off the final test run", when: "7 weeks ago" },
    ],
  },
  "3": {
    description:
      "Sales, support and finance each keep their own numbers today. The dashboard pulls them into one view with a few filters, and managers can bookmark the views they care about.",
    team: ["nachiket5", "nachiket2", "nachiket1"],
    tasks: [
      ["Connect the support ticket export", "nachiket5", "done"],
      ["Revenue by region chart", "nachiket1", "in-progress"],
      ["Saved views", "nachiket2", "todo"],
      ["Decide on a refresh schedule", "nachiket5", "todo"],
    ],
    activity: [
      { who: "Nachiket Shilwant", what: "added the support data import job", when: "Yesterday" },
      { who: "Nachiket Shilwant", what: "opened a PR for the revenue chart", when: "2 days ago" },
    ],
  },
  "4": {
    description:
      "About 400 pages need to move from the old wiki. We converted the first batch, but several teams still have to confirm which pages can be deleted before we continue.",
    team: ["nachiket", "nachiket1"],
    tasks: [
      ["Convert the first 120 pages", "nachiket", "done"],
      ["Get sign-off from team owners", "nachiket1", "in-progress"],
      ["Set up redirects from old URLs", "nachiket", "todo"],
    ],
    activity: [
      { who: "Nachiket Shilwant", what: "put the project on hold", when: "3 weeks ago" },
      { who: "Nachiket Shilwant", what: "finished the first conversion batch", when: "4 weeks ago" },
    ],
  },
  "5": {
    description:
      "Billing used to run from three cron jobs that nobody wanted to touch. The new service listens for events, charges customers and retries failures with backoff. Most traffic has already moved over.",
    team: ["nachiket2", "nachiket3", "nachiket4"],
    tasks: [
      ["Retry with exponential backoff", "nachiket2", "done"],
      ["Move EU customers over", "nachiket3", "done"],
      ["Load test with last month's volume", "nachiket4", "in-progress"],
      ["Remove the old cron jobs", "nachiket2", "todo"],
    ],
    activity: [
      { who: "Nachiket Shilwant", what: "moved the EU customers to the new service", when: "5 hours ago" },
      { who: "Nachiket Shilwant", what: "reviewed the retry logic", when: "Yesterday" },
      { who: "Nachiket Shilwant", what: "started the load test", when: "2 days ago" },
    ],
  },
  "6": {
    description:
      "Finance wants every invoice in the accounting system within a few minutes of being issued. The vendor API times out now and then, so most of the work is handling that gracefully.",
    team: ["nachiket5", "nachiket1"],
    tasks: [
      ["Map invoice fields to the accounting schema", "nachiket5", "done"],
      ["Queue and retry on vendor timeouts", "nachiket1", "in-progress"],
      ["Weekly reconciliation report", "nachiket5", "todo"],
    ],
    activity: [
      { who: "Nachiket Shilwant", what: "added a retry queue for timeouts", when: "Today" },
      { who: "Nachiket Shilwant", what: "asked finance for sample invoices", when: "4 days ago" },
    ],
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export function isStatus(value: string | undefined): value is Status {
  return STATUSES.includes(value as Status);
}

export function filterProjects(search?: string, status?: string) {
  const term = search?.trim().toLowerCase();
  return projects.filter((p) => {
    if (isStatus(status) && p.status !== status) return false;
    if (!term) return true;
    const haystack = `${p.name} ${p.summary} ${p.tags.join(" ")}`.toLowerCase();
    return haystack.includes(term);
  });
}

export function getProjectBasic(id: string): Project {
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();
  return project;
}

let invoiceSyncCalls = 0;

export const getProjectDetails = cache(
  async (id: string): Promise<ProjectDetails> => {
    const project = getProjectBasic(id);
    await sleep(1200);

    if (id === "6") {
      invoiceSyncCalls += 1;
      if (invoiceSyncCalls % 2 === 1) {
        throw new Error("The accounting vendor API timed out");
      }
    }

    const extra = detailsById[id];
    return {
      ...project,
      description: extra.description,
      team: extra.team.map((key) => people[key]),
      tasks: extra.tasks.map(([title, who, state], i) => ({
        id: `${id}-${i}`,
        title,
        assignee: people[who].name,
        state,
      })),
      activity: extra.activity,
    };
  }
);

export async function getRecentActivity() {
  await sleep(2000);
  return Object.entries(detailsById)
    .flatMap(([id, d]) =>
      d.activity.slice(0, 1).map((a) => ({
        ...a,
        project: projects.find((p) => p.id === id)!.name,
        projectId: id,
      }))
    )
    .slice(0, 5);
}

export async function getAllTeamMembers() {
  await sleep(3200);
  return Object.values(people).map((person) => {
    const count = Object.values(detailsById).filter((d) =>
      d.team.some((key) => people[key].name === person.name)
    ).length;
    return { ...person, projectCount: count };
  });
}
