"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

type Course = {
  id: number;
  name: string;
  category?: string | null;
  duration?: string | null;
  fee?: number | null;
  registrationFee?: number | null;
  entryRequirement?: string | null;
  description?: string | null;
  isActive?: boolean;
};

type CourseResponse = {
  message: string;
  data: Course[];
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    duration: "",
    fee: "",
    registrationFee: "",
    entryRequirement: "",
    description: "",
  });

  async function loadCourses() {
    try {
      setError("");
      const result = await apiGet<CourseResponse>("/api/courses");
      setCourses(result.data || []);
    } catch (err) {
      console.error("Load courses error:", err);
      setError("Failed to load courses. Please check whether backend is running.");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        fee: form.fee ? Number(form.fee) : null,
        registrationFee: form.registrationFee
          ? Number(form.registrationFee)
          : null,
      };

      if (editingCourseId) {
        await apiPatch(`/api/courses/${editingCourseId}`, payload);
      } else {
        await apiPost("/api/courses", payload);
      }

      setForm({
        name: "",
        category: "",
        duration: "",
        fee: "",
        registrationFee: "",
        entryRequirement: "",
        description: "",
      });
      setEditingCourseId(null);

      await loadCourses();
      alert(editingCourseId ? "Course updated successfully" : "Course created successfully");
    } catch (err) {
      console.error("Create/update course error:", err);
      setError("Failed to save course. Please check backend or form data.");
    } finally {
      setLoading(false);
    }
  }

  function startEditCourse(course: Course) {
    setEditingCourseId(course.id);
    setForm({
      name: course.name,
      category: course.category || "",
      duration: course.duration || "",
      fee: course.fee?.toString() || "",
      registrationFee: course.registrationFee?.toString() || "",
      entryRequirement: course.entryRequirement || "",
      description: course.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteCourse(courseId: number) {
    const ok = window.confirm("Delete this course permanently?");
    if (!ok) return;

    try {
      await apiDelete(`/api/courses/${courseId}`);
      await loadCourses();
    } catch (err) {
      console.error("Delete course error:", err);
      setError("Failed to delete course. It may be linked to existing leads or admissions.");
    }
  }

  function cancelEdit() {
    setEditingCourseId(null);
    setForm({
      name: "",
      category: "",
      duration: "",
      fee: "",
      registrationFee: "",
      entryRequirement: "",
      description: "",
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(245,158,11,0.18))] p-6 text-white shadow-xl shadow-slate-300/60">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
              Course command center
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Courses
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Create and manage course structure, pricing, and programme details in a consistent admin view.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Total</p>
              <p className="mt-2 text-3xl font-bold text-white">{courses.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Active</p>
              <p className="mt-2 text-3xl font-bold text-white">{courses.filter((course) => course.isActive !== false).length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Inactive</p>
              <p className="mt-2 text-3xl font-bold text-white">{courses.filter((course) => course.isActive === false).length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/80">Categories</p>
              <p className="mt-2 text-3xl font-bold text-white">{new Set(courses.map((course) => course.category).filter(Boolean)).size}</p>
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
          placeholder="Course Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Fee"
          type="number"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Registration Fee"
          type="number"
          value={form.registrationFee}
          onChange={(e) =>
            setForm({ ...form, registrationFee: e.target.value })
          }
        />

        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Entry Requirement"
          value={form.entryRequirement}
          onChange={(e) =>
            setForm({ ...form, entryRequirement: e.target.value })
          }
        />

        <textarea
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none md:col-span-2 xl:col-span-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3">
          <button
            disabled={loading}
            className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Saving..." : editingCourseId ? "Update Course" : "Create Course"}
          </button>

          {editingCourseId && (
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
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Course list
          </div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Manage programs, fees, and active course status.
          </h2>
        </div>

        {pageLoading ? (
          <p className="py-6 text-center text-slate-700">Loading courses...</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-900">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-700">
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Course</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Duration</th>
                  <th className="p-3 font-semibold">Fee</th>
                  <th className="p-3 font-semibold">Reg. Fee</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={index % 2 === 0 ? "border-b border-slate-100 bg-white" : "border-b border-slate-100 bg-slate-50/70"}
                  >
                    <td className="p-3 text-slate-700">{course.id}</td>
                    <td className="p-3 font-semibold text-slate-950">{course.name}</td>
                    <td className="p-3 text-slate-700">{course.category || "-"}</td>
                    <td className="p-3 text-slate-700">{course.duration || "-"}</td>
                    <td className="p-3 text-slate-700">{course.fee ?? "-"}</td>
                    <td className="p-3 text-slate-700">{course.registrationFee ?? "-"}</td>
                    <td className="p-3">
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${course.isActive === false ? "bg-slate-200 text-slate-700 border-slate-300" : "bg-emerald-100 text-emerald-800 border-emerald-200"}`}>
                        {course.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditCourse(course)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {courses.length === 0 && (
              <p className="py-6 text-center text-slate-700">
                No courses found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}