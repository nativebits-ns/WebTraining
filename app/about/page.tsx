import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold">About Project Explorer</h1>
    </div>
  );
}
