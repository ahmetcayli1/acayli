import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // Basic update/create logic
  // We store fields in Json columns
  
  const updateData: any = {
    mode: data.mode,
    // Flatten or map other fields to JSON columns
    personalJson: { firstName: data.firstName, lastName: data.lastName, ...data }, // simplified
    // In a real app we would map properly
    updatedAt: new Date(),
  };

  try {
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...updateData
      },
      update: updateData
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
