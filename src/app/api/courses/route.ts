import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch courses",
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
      name,
      category,
      duration,
      fee,
      registrationFee,
      entryRequirement,
      description,
    } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Course name is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        name,
        category,
        duration,
        fee: fee ? Number(fee) : null,
        registrationFee: registrationFee ? Number(registrationFee) : null,
        entryRequirement,
        description,
      },
    });

    return NextResponse.json(
      {
        message: "Course created successfully",
        data: course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);

    return NextResponse.json(
      {
        message: "Failed to create course",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
