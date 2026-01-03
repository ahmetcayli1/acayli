import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { deleteDataset } from "@/app/lib/dataset";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const stats = await prisma.program.groupBy({
    by: ['country', 'degreeLevel'],
    _count: {
        id: true
    }
  });

  return NextResponse.json({ stats });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { country, degreeLevel } = await req.json();
  await deleteDataset(country, degreeLevel);
  
  return NextResponse.json({ success: true });
}
