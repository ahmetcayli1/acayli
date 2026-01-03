import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runId = params.id;

  const matchRun = await prisma.matchRun.findUnique({
    where: { id: runId },
    include: {
        results: {
            include: { program: true },
            orderBy: { finalScore: 'desc' }
        }
    }
  });

  if (!matchRun) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  // Check entitlement
  const entitlement = await prisma.entitlement.findFirst({
    where: {
        userId: session.user.id,
        type: 'FULL_RESULTS_UNLOCK',
        status: 'ACTIVE'
    }
  });

  const isUnlocked = !!entitlement;

  const processedResults = matchRun.results.map((result, index) => {
    if (isUnlocked || index < 3) {
        return {
            ...result,
            isLocked: false
        };
    } else {
        return {
            id: result.id,
            finalScore: result.finalScore,
            isLocked: true,
            // Mask details
            program: {
                universityName: "Premium University",
                programName: "High Potential Program",
                country: result.program.country, // Show country maybe?
                degreeLevel: result.program.degreeLevel,
            },
            llmJson: null
        };
    }
  });

  return NextResponse.json({
    runId: matchRun.id,
    isUnlocked,
    results: processedResults,
    totalCount: matchRun.results.length
  });
}
