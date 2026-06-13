import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
    }

    const body = await req.json();
    const {
      name,
      category,
      duration,
      fee,
      registrationFee,
      entryRequirement,
      description,
      isActive,
    } = body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(duration !== undefined ? { duration } : {}),
        ...(fee !== undefined ? { fee: fee === null || fee === "" ? null : Number(fee) } : {}),
        ...(registrationFee !== undefined
          ? {
              registrationFee:
                registrationFee === null || registrationFee === ""
                  ? null
                  : Number(registrationFee),
            }
          : {}),
        ...(entryRequirement !== undefined ? { entryRequirement } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json({
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return NextResponse.json(
      {
        message: "Failed to update course",
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
      return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
    }

    // Safely unlink leads and delete admissions before deleting the course
    await prisma.$transaction([
      prisma.lead.updateMany({
        where: { courseId: id },
        data: { courseId: null },
      }),
      prisma.admission.deleteMany({
        where: { courseId: id },
      }),
    ]);

    const course = await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete course",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
