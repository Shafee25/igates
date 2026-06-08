import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 border-r bg-slate-950 text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">iGates LeadFlow</h1>
        <p className="mt-1 text-sm text-slate-300">Admissions CRM</p>
      </div>

      <nav className="space-y-1 px-4">
        <Link
          href="/dashboard"
          className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          href="/courses"
          className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
        >
          Courses
        </Link>

        <Link
          href="/leads"
          className="block rounded-lg px-4 py-3 text-sm hover:bg-slate-800"
        >
          Leads
        </Link>
      </nav>
    </aside>
  );
}