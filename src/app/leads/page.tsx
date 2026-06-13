"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiDelete, apiGet, apiPost, apiPatch } from "@/lib/api";

type Course = {
  id: number;
  name: string;
  category?: string | null;
};

type Lead = {
  id: number;
  fullName: string;
  phone: string;
  whatsapp?: string | null;
  parentPhone?: string | null;
  area?: string | null;
  educationLevel?: string | null;
  preferredMode?: string | null;
  careerGoal?: string | null;
  source?: string | null;
  notes?: string | null;
  status: string;
  priority: string;
  nextFollowUpAt?: string | null;
  course?: Course | null;
};

type CoursesResponse = {
  message: string;
  data: Course[];
};

type LeadsResponse = {
  message: string;
  data: Lead[];
};

function LeadsContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    parentPhone: "",
    area: "",
    educationLevel: "",
    preferredMode: "",
    careerGoal: "",
    source: "",
    notes: "",
    courseId: "",
  });

  async function loadCourses() {
    const result = await apiGet<CoursesResponse>("/api/courses");
    setCourses(result.data || []);
  }

  async function loadLeads() {
    const result = await apiGet<LeadsResponse>("/api/leads");
    setLeads(result.data || []);
  }

  async function loadPageData() {
    try {
      setError("");
      await Promise.all([loadCourses(), loadLeads()]);
    } catch (err) {
      console.error("Load leads page error:", err);
      setError("Failed to load leads. Please check whether backend is running.");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    if (status) {
      setStatusFilter(status.toUpperCase());
    }

    if (priority) {
      setPriorityFilter(priority.toUpperCase());
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        courseId: form.courseId ? Number(form.courseId) : null,
      };

      if (editingLeadId) {
        await apiPatch(`/api/leads/${editingLeadId}`, payload);
      } else {
        await apiPost("/api/leads", payload);
      }

      setForm({
        fullName: "",
        phone: "",
        whatsapp: "",
        parentPhone: "",
        area: "",
        educationLevel: "",
        preferredMode: "",
        careerGoal: "",
        source: "",
        notes: "",
        courseId: "",
      });
      setEditingLeadId(null);

      await loadLeads();
      alert(editingLeadId ? "Lead updated successfully" : "Lead created successfully");
    } catch (err) {
      console.error("Create/update lead error:", err);
      setError("Failed to save lead. Please check form data and backend.");
    } finally {
      setLoading(false);
    }
  }

  function startEditLead(lead: Lead) {
    setEditingLeadId(lead.id);
    setForm({
      fullName: lead.fullName,
      phone: lead.phone,
      whatsapp: lead.whatsapp || "",
      parentPhone: lead.parentPhone || "",
      area: lead.area || "",
      educationLevel: lead.educationLevel || "",
      preferredMode: lead.preferredMode || "",
      careerGoal: lead.careerGoal || "",
      source: lead.source || "",
      notes: lead.notes || "",
      courseId: lead.course?.id ? String(lead.course.id) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteLead(leadId: number) {
    const ok = window.confirm("Delete this lead permanently?");
    if (!ok) return;

    try {
      await apiDelete(`/api/leads/${leadId}`);
      await loadLeads();
    } catch (err) {
      console.error("Delete lead error:", err);
      setError("Failed to delete lead.");
    }
  }

  function cancelEdit() {
    setEditingLeadId(null);
    setForm({
      fullName: "",
      phone: "",
      whatsapp: "",
      parentPhone: "",
      area: "",
      educationLevel: "",
      preferredMode: "",
      careerGoal: "",
      source: "",
      notes: "",
      courseId: "",
    });
  }

  async function updateStatus(leadId: number, status: string) {
    try {
      await apiPatch(`/api/leads/${leadId}/status`, {
        status,
      });

      await loadLeads();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update lead status");
    }
  }

  function getWhatsAppLink(lead: Lead) {
    const number = lead.whatsapp || lead.phone;
    const message = `Hello ${lead.fullName}, thank you for contacting iGates International Campus. We received your inquiry and our team will guide you with course details, fees, duration, and career pathway.`;

    return `https://wa.me/94${number.replace(/^0/, "")}?text=${encodeURIComponent(
      message
    )}`;
  }

  const filteredLeads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.fullName.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        (lead.whatsapp || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || lead.priority === priorityFilter;

      const matchesCourse =
        courseFilter === "ALL" || String(lead.course?.id || "") === courseFilter;

      const matchesArea =
        areaFilter === "ALL" ||
        (lead.area || "").toLowerCase() === areaFilter.toLowerCase();

      const matchesSource =
        sourceFilter === "ALL" ||
        (lead.source || "").toLowerCase() === sourceFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCourse &&
        matchesArea &&
        matchesSource
      );
    });
  }, [
    leads,
    searchTerm,
    statusFilter,
    priorityFilter,
    courseFilter,
    areaFilter,
    sourceFilter,
  ]);

  const uniqueAreas = Array.from(
    new Set(leads.map((lead) => lead.area).filter(Boolean) as string[])
  ).sort();

  const uniqueSources = Array.from(
    new Set(leads.map((lead) => lead.source).filter(Boolean) as string[])
  ).sort();

  const totalLeads = leads.length;
  const visibleLeads = filteredLeads.length;
  const hotLeads = leads.filter((lead) => lead.priority === "HOT").length;
  const registeredLeads = leads.filter((lead) => lead.status === "REGISTERED").length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(59,130,246,0.18))] p-6 text-white shadow-xl shadow-slate-300/60">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
              Lead command center
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Lead List
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Add, manage, follow up, and convert student inquiries from one clean admissions workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Total</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalLeads}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Visible</p>
              <p className="mt-2 text-3xl font-bold text-white">{visibleLeads}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Hot</p>
              <p className="mt-2 text-3xl font-bold text-white">{hotLeads}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Registered</p>
              <p className="mt-2 text-3xl font-bold text-white">{registeredLeads}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80 md:grid-cols-2 xl:grid-cols-3"
      >
        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Student Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Parent Phone"
          value={form.parentPhone}
          onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Area"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        />

        <select
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 focus:border-blue-500 focus:outline-none"
          value={form.educationLevel}
          onChange={(e) =>
            setForm({ ...form, educationLevel: e.target.value })
          }
        >
          <option value="">Select Education Level</option>
          <option value="After O/L">After O/L</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Working">Working</option>
        </select>

        <select
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 focus:border-blue-500 focus:outline-none"
          value={form.preferredMode}
          onChange={(e) => setForm({ ...form, preferredMode: e.target.value })}
        >
          <option value="">Choose Study Mode</option>
          <option value="Physical">Physical</option>
          <option value="Online">Online</option>
        </select>

        <select
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 focus:border-blue-500 focus:outline-none"
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="">Select Interested Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Career Goal"
          value={form.careerGoal}
          onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
        />

        <select
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 focus:border-blue-500 focus:outline-none"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <option value="">Lead Source</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Walk-in">Walk-in</option>
          <option value="Referral">Referral</option>
          <option value="School Visit">School Visit</option>
          <option value="Tuition Class">Tuition Class</option>
          <option value="Open Day">Open Day</option>
        </select>

        <textarea
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none md:col-span-2 xl:col-span-3"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3">
          <button
            disabled={loading}
            className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Saving..." : editingLeadId ? "Update Lead" : "Create Lead"}
          </button>

          {editingLeadId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/80">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6">
          <div className="max-w-xl">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Lead list
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
              Search and filter leads in one line.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Name, phone, status, priority, course, area, and source stay aligned in a single toolbar on larger screens.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:flex-nowrap xl:items-end xl:overflow-x-auto xl:pb-1">
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none xl:w-52 xl:shrink-0"
              placeholder="Search name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none xl:w-44 xl:shrink-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="INTERESTED">INTERESTED</option>
              <option value="VISIT_SCHEDULED">VISIT_SCHEDULED</option>
              <option value="VISITED">VISITED</option>
              <option value="PARENT_DISCUSSION">PARENT_DISCUSSION</option>
              <option value="APPLICATION_PENDING">APPLICATION_PENDING</option>
              <option value="REGISTERED">REGISTERED</option>
              <option value="PAID">PAID</option>
              <option value="LOST">LOST</option>
            </select>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none xl:w-40 xl:shrink-0"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HOT">HOT</option>
              <option value="WARM">WARM</option>
              <option value="COLD">COLD</option>
            </select>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none xl:w-48 xl:shrink-0"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="ALL">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none xl:w-40 xl:shrink-0"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option value="ALL">All Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:border-blue-500 focus:outline-none xl:w-44 xl:shrink-0"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="ALL">All Sources</option>
              {uniqueSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setPriorityFilter("ALL");
                setCourseFilter("ALL");
                setAreaFilter("ALL");
                setSourceFilter("ALL");
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-100 xl:w-auto xl:shrink-0"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {pageLoading ? (
          <p className="py-6 text-center text-slate-700">Loading leads...</p>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.98))] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <span>Lead #{lead.id}</span>
                      <span className="inline-flex rounded-full bg-slate-200 px-2 py-1 text-slate-700">
                        {lead.priority}
                      </span>
                    </div>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="mt-2 block text-2xl font-bold tracking-tight text-slate-950 hover:text-blue-700"
                    >
                      {lead.fullName}
                    </Link>
                    <p className="mt-1 text-sm text-slate-600">
                      {lead.phone} {lead.whatsapp ? `· WhatsApp ${lead.whatsapp}` : ""}
                    </p>
                  </div>

                  <select
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 focus:border-blue-500 focus:outline-none"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="INTERESTED">INTERESTED</option>
                    <option value="VISIT_SCHEDULED">VISIT_SCHEDULED</option>
                    <option value="VISITED">VISITED</option>
                    <option value="PARENT_DISCUSSION">PARENT_DISCUSSION</option>
                    <option value="APPLICATION_PENDING">APPLICATION_PENDING</option>
                    <option value="REGISTERED">REGISTERED</option>
                    <option value="PAID">PAID</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Area</p>
                    <p className="mt-1 font-medium text-slate-900">{lead.area || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Course</p>
                    <p className="mt-1 font-medium text-slate-900">{lead.course?.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Source</p>
                    <p className="mt-1 font-medium text-slate-900">{lead.source || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Parent</p>
                    <p className="mt-1 font-medium text-slate-900">{lead.parentPhone || "-"}</p>
                  </div>
                </div>

                {lead.notes && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Notes
                    </p>
                    <p className="mt-2 leading-6">{lead.notes}</p>
                  </div>
                )}

                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => startEditLead(lead)}
                      className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <a
                      href={getWhatsAppLink(lead)}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Message
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {filteredLeads.length === 0 && (
              <p className="py-6 text-center text-slate-700 xl:col-span-2">
                No leads found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-700">Loading page...</div>}>
      <LeadsContent />
    </Suspense>
  );
}