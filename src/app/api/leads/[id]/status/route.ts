import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const { status, priority, nextFollowUpAt } = body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status,
        priority,
        ...(nextFollowUpAt ? { nextFollowUpAt: new Date(nextFollowUpAt) } : {}),
      },
    });

    return NextResponse.json({
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Update lead status error:", error);

    return NextResponse.json(
      {
        message: "Failed to update lead status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
