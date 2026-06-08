"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface DashboardSummary {
  totalLeads: number;
  totalCourses: number;
  activeCourses: number;
  totalUsers: number;
  hotLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  registeredLeads: number;
  paidLeads: number;
  lostLeads: number;
  todayLeads: number;
  followUpsDueToday: number;
  overdueFollowUps: number;
}

type CardLinkProps = {
  href: string;
  children: React.ReactNode;
  className: string;
};

function CardLink({ href, children, className }: CardLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ data: DashboardSummary }>(
          "/api/dashboard/summary"
        );
        setSummary(response.data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch dashboard";
        setError(message);
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(14,165,233,0.18))] p-6 text-white shadow-xl shadow-slate-300/60">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
                Dashboard command center
              </div>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Live CRM metrics for management and admissions teams.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80">
          <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Key metrics
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-200/60"
            />
          ))}
        </div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(14,165,233,0.18))] p-6 text-white shadow-xl shadow-slate-300/60">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
              Dashboard command center
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Live CRM metrics for management and admissions teams.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
          {error || "Failed to load dashboard data"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(14,165,233,0.18))] p-6 text-white shadow-xl shadow-slate-300/60">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
              Dashboard command center
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Welcome to iGates LeadFlow admissions CRM.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CardLink
              href="/leads"
              className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Total Leads</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{summary.totalLeads}</h2>
            </CardLink>
            <CardLink
              href="/courses"
              className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Courses</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{summary.totalCourses}</h2>
            </CardLink>
            <CardLink
              href="/leads?priority=HOT"
              className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Hot Leads</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{summary.hotLeads}</h2>
            </CardLink>
            <CardLink
              href="/leads?status=REGISTERED"
              className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Registered</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{summary.registeredLeads}</h2>
            </CardLink>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Key metrics
          </div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Live numbers and quick drill-downs.
          </h2>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Leads */}
          <CardLink
            href="/leads"
            className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Total Leads</p>
                <h2 className="mt-2 text-4xl font-bold text-slate-950">
                  {summary.totalLeads}
                </h2>
              </div>
              <div className="rounded-2xl bg-blue-100 px-3 py-2 text-3xl text-blue-700">👥</div>
            </div>
          </CardLink>

          {/* Total Courses */}
          <CardLink
            href="/courses"
            className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Total Courses</p>
                <h2 className="mt-2 text-4xl font-bold text-slate-950">
                  {summary.totalCourses}
                </h2>
              </div>
              <div className="rounded-2xl bg-indigo-100 px-3 py-2 text-3xl text-indigo-700">📚</div>
            </div>
          </CardLink>

          {/* Hot Leads */}
          <CardLink
            href="/leads?priority=HOT"
            className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Hot Leads</p>
                <h2 className="mt-2 text-4xl font-bold text-slate-950">
                  {summary.hotLeads}
                </h2>
              </div>
              <div className="rounded-2xl bg-red-100 px-3 py-2 text-3xl text-red-700">🔥</div>
            </div>
          </CardLink>

          {/* Registered Leads */}
          <CardLink
            href="/leads?status=REGISTERED"
            className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Registered</p>
                <h2 className="mt-2 text-4xl font-bold text-slate-950">
                  {summary.registeredLeads}
                </h2>
              </div>
              <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-3xl text-emerald-700">✅</div>
            </div>
          </CardLink>
        </div>
      </div>

      {/* Lead Status Breakdown */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-slate-950">
          Lead Status Breakdown
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* New */}
          <CardLink href="/leads?status=NEW" className="rounded-2xl border border-blue-200 bg-blue-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">New</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-950">
              {summary.newLeads}
            </h2>
          </CardLink>

          {/* Contacted */}
          <CardLink href="/leads?status=CONTACTED" className="rounded-2xl border border-purple-200 bg-purple-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-purple-700">Contacted</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-950">
              {summary.contactedLeads}
            </h2>
          </CardLink>

          {/* Interested */}
          <CardLink href="/leads?status=INTERESTED" className="rounded-2xl border border-amber-200 bg-amber-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Interested</p>
            <h2 className="mt-2 text-3xl font-bold text-amber-950">
              {summary.interestedLeads}
            </h2>
          </CardLink>

          {/* Paid */}
          <CardLink href="/leads?status=PAID" className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Paid</p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950">
              {summary.paidLeads}
            </h2>
          </CardLink>

          {/* Lost */}
          <CardLink href="/leads?status=LOST" className="rounded-2xl border border-red-200 bg-red-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-red-700">Lost</p>
            <h2 className="mt-2 text-3xl font-bold text-red-950">
              {summary.lostLeads}
            </h2>
          </CardLink>

          {/* Today's Leads */}
          <CardLink href="/leads" className="rounded-2xl border border-cyan-200 bg-cyan-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Today</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-950">
              {summary.todayLeads}
            </h2>
          </CardLink>

          {/* Follow-ups Due */}
          <CardLink href="/leads" className="rounded-2xl border border-indigo-200 bg-indigo-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-700">
              Follow-ups Due Today
            </p>
            <h2 className="mt-2 text-3xl font-bold text-indigo-950">
              {summary.followUpsDueToday}
            </h2>
          </CardLink>

          {/* Overdue */}
          <CardLink href="/leads" className="rounded-2xl border border-orange-200 bg-orange-50/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-orange-700">Overdue</p>
            <h2 className="mt-2 text-3xl font-bold text-orange-950">
              {summary.overdueFollowUps}
            </h2>
          </CardLink>
        </div>
      </div>
    </div>
  );
}