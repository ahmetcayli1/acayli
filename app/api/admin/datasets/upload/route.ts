import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import { processDataset } from "@/app/lib/dataset";
import fs from "fs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const country = formData.get("country") as string;
    const degreeLevel = formData.get("degreeLevel") as any;

    if (!file || !country || !degreeLevel) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${country.toLowerCase()}_${degreeLevel.toLowerCase()}.xlsx`;
    const dirPath = path.join(process.cwd(), 'data', degreeLevel.toLowerCase());
    
    // Ensure dir exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, fileName);
    await writeFile(filePath, buffer);

    // Process
    const count = await processDataset(country, degreeLevel);

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Dataset Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
