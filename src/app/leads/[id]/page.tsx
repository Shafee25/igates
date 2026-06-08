"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import Link from "next/link";

type Course = {
  id: number;
  name: string;
  category?: string | null;
  fee?: number | null;
};

type FollowUp = {
  id: number;
  type: string;
  outcome?: string | null;
  note?: string | null;
  followUpDate: string;
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
  notes?: string | null;
  course?: Course | null;
  followUps?: FollowUp[];
  admission?: {
    id: number;
    registrationDate: string;
    totalFee?: number | null;
    paidAmount: number;
    balanceAmount?: number | null;
    paymentStatus: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

const getStatusBadgeStyle = (status: string) => {
  const styles: { [key: string]: string } = {
    NEW: "bg-blue-200 text-blue-900",
    CONTACTED: "bg-purple-200 text-purple-900",
    INTERESTED: "bg-amber-200 text-amber-900",
    VISIT_SCHEDULED: "bg-indigo-200 text-indigo-900",
    REGISTERED: "bg-green-200 text-green-900",
    PAID: "bg-emerald-200 text-emerald-900",
    LOST: "bg-red-200 text-red-900",
  };
  return styles[status] || "bg-slate-200 text-slate-900";
};

const getPriorityBadgeStyle = (priority: string) => {
  const styles: { [key: string]: string } = {
    HOT: "bg-red-200 text-red-900",
    WARM: "bg-orange-200 text-orange-900",
    COLD: "bg-blue-200 text-blue-900",
  };
  return styles[priority] || "bg-slate-200 text-slate-900";
};

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const statuses = [
    "NEW",
    "CONTACTED",
    "INTERESTED",
    "VISIT_SCHEDULED",
    "REGISTERED",
    "PAID",
    "LOST",
  ];
  const priorities = ["HOT", "WARM", "COLD"];

  useEffect(() => {
    loadLead();
  }, [leadId]);

  async function loadLead() {
    try {
      setLoading(true);
      const result = await apiGet<{ data: Lead }>(`/api/leads/${leadId}`);
      setLead(result.data);
      setError("");
    } catch (err) {
      console.error("Load lead error:", err);
      setError("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    if (!lead) return;
    try {
      setUpdating(true);
      await apiPatch(`/api/leads/${lead.id}/status`, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      setShowStatusDropdown(false);
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function updatePriority(newPriority: string) {
    if (!lead) return;
    try {
      setUpdating(true);
      await apiPatch(`/api/leads/${lead.id}/status`, { priority: newPriority });
      setLead({ ...lead, priority: newPriority });
      setShowPriorityDropdown(false);
    } catch (err) {
      console.error("Update priority error:", err);
      alert("Failed to update priority");
    } finally {
      setUpdating(false);
    }
  }

  function getWhatsAppLink() {
    if (!lead) return "#";
    const number = lead.whatsapp || lead.phone;
    const message = `Hello ${lead.fullName}, thank you for contacting iGates International Campus. We're excited to discuss your career pathway and course options.`;
    return `https://wa.me/94${number.replace(/^0/, "")}?text=${encodeURIComponent(
      message
    )}`;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-300" />
        <div className="space-y-4 rounded-xl bg-white p-6 shadow">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-full animate-pulse rounded bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div>
        <Link
          href="/leads"
          className="mb-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Leads
        </Link>
        <div className="rounded-xl bg-red-100 p-6 text-red-900 border border-red-300">
          <p className="text-lg font-bold">{error || "Lead not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/leads"
            className="mb-3 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            ← Back to Leads
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">{lead.fullName}</h1>
          <p className="mt-2 text-slate-700 text-lg">Lead ID: {lead.id}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
          >
            💬 WhatsApp
          </a>
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            📞 Call
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 xl:col-span-2">
          {/* Contact Information */}
          <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              📞 Contact Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-blue-50 p-5 border border-blue-200">
                <p className="text-sm font-bold text-blue-700 uppercase">Phone</p>
                <p className="mt-2 text-xl font-bold text-blue-900">{lead.phone}</p>
              </div>

              {lead.whatsapp && (
                <div className="rounded-lg bg-green-50 p-5 border border-green-200">
                  <p className="text-sm font-bold text-green-700 uppercase">WhatsApp</p>
                  <p className="mt-2 text-xl font-bold text-green-900">{lead.whatsapp}</p>
                </div>
              )}

              {lead.parentPhone && (
                <div className="rounded-lg bg-purple-50 p-5 border border-purple-200">
                  <p className="text-sm font-bold text-purple-700 uppercase">Parent Phone</p>
                  <p className="mt-2 text-xl font-bold text-purple-900">{lead.parentPhone}</p>
                </div>
              )}

              {lead.area && (
                <div className="rounded-lg bg-orange-50 p-5 border border-orange-200">
                  <p className="text-sm font-bold text-orange-700 uppercase">Area</p>
                  <p className="mt-2 text-xl font-bold text-orange-900">{lead.area}</p>
                </div>
              )}

              {lead.educationLevel && (
                <div className="rounded-lg bg-indigo-50 p-5 border border-indigo-200">
                  <p className="text-sm font-bold text-indigo-700 uppercase">Education Level</p>
                  <p className="mt-2 text-xl font-bold text-indigo-900">{lead.educationLevel}</p>
                </div>
              )}

              {lead.preferredMode && (
                <div className="rounded-lg bg-cyan-50 p-5 border border-cyan-200">
                  <p className="text-sm font-bold text-cyan-700 uppercase">Study Mode</p>
                  <p className="mt-2 text-xl font-bold text-cyan-900">{lead.preferredMode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Info */}
          <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              📚 Academic Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {lead.course && (
                <div className="rounded-lg bg-yellow-50 p-5 border border-yellow-200">
                  <p className="text-sm font-bold text-yellow-700 uppercase">Interested Course</p>
                  <p className="mt-2 text-xl font-bold text-yellow-900">{lead.course.name}</p>
                  {lead.course.category && (
                    <p className="mt-2 text-sm text-yellow-800">
                      📂 {lead.course.category}
                    </p>
                  )}
                </div>
              )}

              {lead.careerGoal && (
                <div className="rounded-lg bg-pink-50 p-5 border border-pink-200">
                  <p className="text-sm font-bold text-pink-700 uppercase">Career Goal</p>
                  <p className="mt-2 text-xl font-bold text-pink-900">{lead.careerGoal}</p>
                </div>
              )}

              {lead.source && (
                <div className="rounded-lg bg-lime-50 p-5 border border-lime-200">
                  <p className="text-sm font-bold text-lime-700 uppercase">Source</p>
                  <p className="mt-2 text-xl font-bold text-lime-900">{lead.source}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">📝 Notes</h2>
              <div className="rounded-lg bg-slate-100 p-5 border-l-4 border-slate-400">
                <p className="text-lg text-slate-900">{lead.notes}</p>
              </div>
            </div>
          )}

          {/* Follow-up History */}
          {lead.followUps && lead.followUps.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                📋 Follow-up History
              </h2>
              <div className="space-y-4">
                {lead.followUps.map((followUp) => (
                  <div key={followUp.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-blue-900 text-lg">{followUp.type}</p>
                      <p className="text-sm font-semibold text-blue-700">
                        {new Date(followUp.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                    {followUp.outcome && (
                      <p className="mt-2 text-sm text-blue-900">
                        <strong>Outcome:</strong> {followUp.outcome}
                      </p>
                    )}
                    {followUp.note && (
                      <p className="mt-1 text-sm text-blue-900">
                        <strong>Note:</strong> {followUp.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">⚙️ Status</h3>

            {/* Current Status */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-slate-700 uppercase">Current Status</p>
              <span
                className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${getStatusBadgeStyle(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
            </div>

            {/* Status Dropdown */}
            <div className="relative mb-6">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={updating}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 px-4 py-3 text-left font-bold text-slate-900 disabled:cursor-not-allowed"
              >
                Change Status ▼
              </button>

              {showStatusDropdown && (
                <div className="absolute top-full z-10 mt-2 w-full rounded-lg border-2 border-slate-300 bg-white shadow-lg">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      disabled={updating}
                      className={`block w-full px-4 py-3 text-left font-semibold hover:bg-slate-200 disabled:cursor-not-allowed border-b border-slate-100 last:border-b-0 ${
                        lead.status === status ? "bg-slate-100 text-blue-900" : "text-slate-900"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-slate-700 uppercase">Priority</p>
              <span
                className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${getPriorityBadgeStyle(
                  lead.priority
                )}`}
              >
                {lead.priority}
              </span>
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                disabled={updating}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 px-4 py-3 text-left font-bold text-slate-900 disabled:cursor-not-allowed"
              >
                Change Priority ▼
              </button>

              {showPriorityDropdown && (
                <div className="absolute top-full z-10 mt-2 w-full rounded-lg border-2 border-slate-300 bg-white shadow-lg">
                  {priorities.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => updatePriority(priority)}
                      disabled={updating}
                      className={`block w-full px-4 py-3 text-left font-semibold hover:bg-slate-200 disabled:cursor-not-allowed border-b border-slate-100 last:border-b-0 ${
                        lead.priority === priority ? "bg-slate-100 text-red-900" : "text-slate-900"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Admission Status */}
          {lead.admission && (
            <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
              <h3 className="mb-6 text-2xl font-bold text-slate-900">💳 Admission Info</h3>

              <div className="space-y-4">
                <div className="rounded-lg bg-slate-100 p-5 border border-slate-300">
                  <p className="text-sm font-bold text-slate-700 uppercase">Payment Status</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{lead.admission.paymentStatus}</p>
                </div>

                {lead.admission.totalFee && (
                  <div className="rounded-lg bg-slate-100 p-5 border border-slate-300">
                    <p className="text-sm font-bold text-slate-700 uppercase">Total Fee</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">Rs. {lead.admission.totalFee.toLocaleString()}</p>
                  </div>
                )}

                <div className="rounded-lg bg-green-100 p-5 border border-green-300">
                  <p className="text-sm font-bold text-green-700 uppercase">Paid Amount</p>
                  <p className="mt-2 text-xl font-bold text-green-900">Rs. {lead.admission.paidAmount.toLocaleString()}</p>
                </div>

                {lead.admission.balanceAmount && (
                  <div className="rounded-lg bg-red-100 p-5 border border-red-300">
                    <p className="text-sm font-bold text-red-700 uppercase">Balance</p>
                    <p className="mt-2 text-xl font-bold text-red-900">Rs. {lead.admission.balanceAmount.toLocaleString()}</p>
                  </div>
                )}

                <div className="rounded-lg bg-slate-100 p-5 border border-slate-300">
                  <p className="text-sm font-bold text-slate-700 uppercase">Registered Date</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{new Date(lead.admission.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-xl bg-white p-6 shadow border border-slate-200">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">📅 Timeline</h3>

            <div className="space-y-4">
              <div className="rounded-lg bg-slate-100 p-5 border border-slate-300">
                <p className="text-sm font-bold text-slate-700 uppercase">Created At</p>
                <p className="mt-2 font-semibold text-slate-900">{new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString()}</p>
              </div>

              <div className="rounded-lg bg-slate-100 p-5 border border-slate-300">
                <p className="text-sm font-bold text-slate-700 uppercase">Last Updated</p>
                <p className="mt-2 font-semibold text-slate-900">{new Date(lead.updatedAt).toLocaleDateString()} at {new Date(lead.updatedAt).toLocaleTimeString()}</p>
              </div>

              {lead.nextFollowUpAt && (
                <div className="rounded-lg border-l-4 border-blue-600 bg-blue-100 p-5">
                  <p className="text-sm font-bold text-blue-700 uppercase">Next Follow-up</p>
                  <p className="mt-2 font-bold text-blue-900">{new Date(lead.nextFollowUpAt).toLocaleDateString()} at {new Date(lead.nextFollowUpAt).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
