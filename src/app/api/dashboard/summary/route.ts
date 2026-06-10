const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptySummary = {
  totalLeads: 0,
  totalCourses: 0,
  activeCourses: 0,
  totalUsers: 0,
  hotLeads: 0,
  newLeads: 0,
  contactedLeads: 0,
  interestedLeads: 0,
  registeredLeads: 0,
  paidLeads: 0,
  lostLeads: 0,
  todayLeads: 0,
  followUpsDueToday: 0,
  overdueFollowUps: 0,
};

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/api/dashboard/summary`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend dashboard summary returned ${response.status}`);
    }

    const payload = await response.json();
    return Response.json(payload);
  } catch {
    return Response.json({ data: emptySummary });
  }
}