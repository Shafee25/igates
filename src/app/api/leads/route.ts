import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        course: true,
        assignedTo: true,
        campaign: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch leads",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      whatsapp,
      parentPhone,
      area,
      educationLevel,
      preferredMode,
      careerGoal,
      source,
      notes,
      courseId,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { message: "Student name and phone number are required" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        fullName,
        phone,
        whatsapp,
        parentPhone,
        area,
        educationLevel,
        preferredMode,
        careerGoal,
        source,
        notes,
        courseId: courseId ? Number(courseId) : null,
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json(
      {
        message: "Lead created successfully",
        data: lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead error:", error);

    return NextResponse.json(
      {
        message: "Failed to create lead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
