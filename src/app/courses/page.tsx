"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Course = {
  id: number;
  name: string;
  category?: string | null;
  duration?: string | null;
  fee?: number | null;
  registrationFee?: number | null;
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
      await apiPost("/api/courses", {
        ...form,
        fee: form.fee ? Number(form.fee) : null,
        registrationFee: form.registrationFee
          ? Number(form.registrationFee)
          : null,
      });

      setForm({
        name: "",
        category: "",
        duration: "",
        fee: "",
        registrationFee: "",
        entryRequirement: "",
        description: "",
      });

      await loadCourses();
      alert("Course created successfully");
    } catch (err) {
      console.error("Create course error:", err);
      setError("Failed to create course. Please check backend or form data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
      <p className="mt-2 text-slate-600">
        Create and manage iGates programme/course details.
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
          placeholder="Course Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Fee"
          type="number"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Registration Fee"
          type="number"
          value={form.registrationFee}
          onChange={(e) =>
            setForm({ ...form, registrationFee: e.target.value })
          }
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Entry Requirement"
          value={form.entryRequirement}
          onChange={(e) =>
            setForm({ ...form, entryRequirement: e.target.value })
          }
        />

        <textarea
          className="rounded-lg border p-3 md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          disabled={loading}
          className="rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 md:col-span-2"
        >
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold">Course List</h2>

        {pageLoading ? (
          <p className="py-6 text-center text-slate-500">Loading courses...</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3">ID</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3">Reg. Fee</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b">
                    <td className="p-3">{course.id}</td>
                    <td className="p-3 font-medium">{course.name}</td>
                    <td className="p-3">{course.category || "-"}</td>
                    <td className="p-3">{course.duration || "-"}</td>
                    <td className="p-3">{course.fee ?? "-"}</td>
                    <td className="p-3">{course.registrationFee ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {courses.length === 0 && (
              <p className="py-6 text-center text-slate-500">
                No courses found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}