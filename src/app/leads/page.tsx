"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch } from "@/lib/api";

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

export default function LeadsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiPost("/api/leads", {
        ...form,
        courseId: form.courseId ? Number(form.courseId) : null,
      });

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

      await loadLeads();
      alert("Lead created successfully");
    } catch (err) {
      console.error("Create lead error:", err);
      setError("Failed to create lead. Please check form data and backend.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
      <p className="mt-2 text-slate-600">
        Add, manage, follow up, and convert student inquiries.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
      >
        <input
          className="rounded-lg border p-3"
          placeholder="Student Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Parent Phone"
          value={form.parentPhone}
          onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Area"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
        />

        <select
          className="rounded-lg border p-3"
          value={form.educationLevel}
          onChange={(e) =>
            setForm({ ...form, educationLevel: e.target.value })
          }
        >
          <option value="">Select Education Level</option>
          <option value="After O/L">After O/L</option>
          <option value="After A/L">After A/L</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Working">Working</option>
        </select>

        <select
          className="rounded-lg border p-3"
          value={form.preferredMode}
          onChange={(e) => setForm({ ...form, preferredMode: e.target.value })}
        >
          <option value="">Preferred Study Mode</option>
          <option value="Weekday">Weekday</option>
          <option value="Weekend">Weekend</option>
          <option value="Evening">Evening</option>
          <option value="Online">Online</option>
        </select>

        <select
          className="rounded-lg border p-3"
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
          className="rounded-lg border p-3"
          placeholder="Career Goal"
          value={form.careerGoal}
          onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
        />

        <select
          className="rounded-lg border p-3"
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
          className="rounded-lg border p-3 md:col-span-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button
          disabled={loading}
          className="rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 md:col-span-2"
        >
          {loading ? "Saving..." : "Create Lead"}
        </button>
      </form>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold">Lead List</h2>

        {pageLoading ? (
          <p className="py-6 text-center text-slate-500">Loading leads...</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3">ID</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">WhatsApp</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    <td className="p-3">{lead.id}</td>
                    <td className="p-3 font-medium">{lead.fullName}</td>
                    <td className="p-3">{lead.phone}</td>
                    <td className="p-3">{lead.area || "-"}</td>
                    <td className="p-3">{lead.course?.name || "-"}</td>
                    <td className="p-3">{lead.source || "-"}</td>
                    <td className="p-3">{lead.priority}</td>

                    <td className="p-3">
                      <select
                        className="rounded border p-2"
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="VISIT_SCHEDULED">VISIT_SCHEDULED</option>
                        <option value="VISITED">VISITED</option>
                        <option value="PARENT_DISCUSSION">
                          PARENT_DISCUSSION
                        </option>
                        <option value="APPLICATION_PENDING">
                          APPLICATION_PENDING
                        </option>
                        <option value="REGISTERED">REGISTERED</option>
                        <option value="PAID">PAID</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <a
                        href={getWhatsAppLink(lead)}
                        target="_blank"
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Message
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {leads.length === 0 && (
              <p className="py-6 text-center text-slate-500">
                No leads found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}