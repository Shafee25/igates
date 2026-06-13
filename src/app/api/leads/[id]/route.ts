import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        course: true,
        assignedTo: true,
        campaign: true,
        followUps: true,
        admission: true,
        lostReason: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Lead fetched successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Get lead by ID error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch lead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: "Invalid lead ID" }, { status: 400 });
    }

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
      status,
      priority,
      nextFollowUpAt,
    } = body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(whatsapp !== undefined ? { whatsapp } : {}),
        ...(parentPhone !== undefined ? { parentPhone } : {}),
        ...(area !== undefined ? { area } : {}),
        ...(educationLevel !== undefined ? { educationLevel } : {}),
        ...(preferredMode !== undefined ? { preferredMode } : {}),
        ...(careerGoal !== undefined ? { careerGoal } : {}),
        ...(source !== undefined ? { source } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(courseId !== undefined
          ? { courseId: courseId ? Number(courseId) : null }
          : {}),
        ...(status !== undefined ? { status } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(nextFollowUpAt !== undefined
          ? {
              nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : null,
            }
          : {}),
      },
      include: {
        course: true,
        assignedTo: true,
        campaign: true,
      },
    });

    return NextResponse.json({
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return NextResponse.json(
      {
        message: "Failed to update lead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: "Invalid lead ID" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.followUp.deleteMany({ where: { leadId: id } }),
      prisma.lostReason.deleteMany({ where: { leadId: id } }),
      prisma.admission.deleteMany({ where: { leadId: id } }),
      prisma.lead.delete({ where: { id } }),
    ]);

    return NextResponse.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete lead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
