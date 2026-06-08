"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItemClass = (href: string) => {
    const isActive = pathname === href;

    return [
      "block rounded-xl px-4 py-3 text-sm font-semibold transition",
      isActive
        ? "bg-white text-slate-950 shadow-md"
        : "text-slate-300 hover:bg-slate-900 hover:text-white",
    ].join(" ");
  };

  return (
    <aside className="min-h-screen w-64 border-r border-slate-800 bg-[#07111f] text-white shadow-2xl shadow-slate-950/20">
      <div className="p-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <Image
            src="/images/igates-logo.png"
            alt="iGates Logo"
            width={45}
            height={45}
            className="rounded-md bg-white p-1"
          />

          <div>
            <h1 className="text-lg font-bold leading-tight text-white">iGates</h1>
            <p className="text-xs text-slate-300">LeadFlow CRM</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 px-4">
        <Link
          href="/dashboard"
          className={navItemClass("/dashboard")}
        >
          Dashboard
        </Link>

        <Link
          href="/courses"
          className={navItemClass("/courses")}
        >
          Courses
        </Link>

        <Link
          href="/leads"
          className={navItemClass("/leads")}
        >
          Leads
        </Link>
      </nav>
    </aside>
  );
}