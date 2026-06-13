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

    const course = await prisma.course.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Course deactivated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return NextResponse.json(
      {
        message: "Failed to deactivate course",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
