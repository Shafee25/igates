import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get total counts
    const [totalLeads, totalCourses, totalUsers] = await Promise.all([
      prisma.lead.count(),
      prisma.course.count(),
      prisma.user.count(),
    ]);

    // Get leads by status
    const [
      newLeads,
      contactedLeads,
      interestedLeads,
      registeredLeads,
      paidLeads,
      lostLeads,
    ] = await Promise.all([
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "CONTACTED" } }),
      prisma.lead.count({ where: { status: "INTERESTED" } }),
      prisma.lead.count({ where: { status: "REGISTERED" } }),
      prisma.lead.count({ where: { status: "PAID" } }),
      prisma.lead.count({ where: { status: "LOST" } }),
    ]);

    // Get hot leads (priority = HOT)
    const hotLeads = await prisma.lead.count({
      where: { priority: "HOT" },
    });

    // Get today's leads (created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLeads = await prisma.lead.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Get active courses
    const activeCourses = await prisma.course.count({
      where: { isActive: true },
    });

    // Get follow-ups due today
    const followUpsDueToday = await prisma.followUp.count({
      where: {
        followUpDate: {
          gte: today,
        },
      },
    });

    // Get overdue follow-ups
    const now = new Date();
    const overdueFollowUps = await prisma.followUp.count({
      where: {
        nextFollowUpAt: {
          lt: now,
        },
      },
    });

    return NextResponse.json({
      message: "Dashboard summary fetched successfully",
      data: {
        totalLeads,
        totalCourses,
        activeCourses,
        totalUsers,
        hotLeads,
        newLeads,
        contactedLeads,
        interestedLeads,
        registeredLeads,
        paidLeads,
        lostLeads,
        todayLeads,
        followUpsDueToday,
        overdueFollowUps,
      },
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch dashboard summary",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
