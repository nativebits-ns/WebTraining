import Link from "next/link";
import NavLink from "./NavLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Project Explorer
        </Link>
        <nav aria-label="Main" className="flex gap-1 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100"
              activeClassName="bg-teal-50! text-teal-800! font-medium"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
