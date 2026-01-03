import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getEmbedding } from "@/app/lib/openai";
import { DegreeLevel } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const countries = (profile.personalJson as any)?.countries || ["DE"]; // Default to Germany if empty
    const mode = profile.mode;

    // Create MatchRun
    const matchRun = await prisma.matchRun.create({
      data: {
        userId: session.user.id,
        profileId: profile.id,
        selectedCountries: countries,
        selectedLanguages: ["EN"], // Default
        requestedCount: 20
      }
    });

    // Generate embedding for user profile (Mocked text representation)
    const profileText = `Student looking for ${mode} in ${countries.join(', ')}. Interests: Computer Science, Engineering. GPA: High.`;
    const userVector = await getEmbedding(profileText);
    const vectorString = `[${userVector.join(',')}]`;

    // 1. Vector Search
    // Note: ensure countries is formatted as array literal for SQL if needed, or parameter
    
    // Prisma Raw Query
    const programs: any[] = await prisma.$queryRaw`
      SELECT 
        id, 
        "universityName", 
        "programName", 
        "country", 
        1 - ("embedding" <=> ${vectorString}::vector) as similarity
      FROM "Program"
      WHERE "degreeLevel" = ${mode}::"DegreeLevel"
      AND "country" = ANY(${countries}::text[])
      ORDER BY similarity DESC
      LIMIT 50;
    `;

    // 2. Process and Save Results
    // In a real app, we would do Pre-scoring and LLM scoring here.
    // We'll mock LLM Score and Final Score.
    
    const resultsToCreate = programs.map((prog, index) => {
      // Mock scores
      const preScore = 80 + (Math.random() * 20);
      const llmScore = 70 + (Math.random() * 30);
      const admissionProb = Math.floor(60 + Math.random() * 35);
      
      const finalScore = (prog.similarity * 40) + (preScore * 0.3) + (llmScore * 0.3);

      const llmJson = {
        admission_probability: admissionProb,
        strengths: ["Strong academic background match", "Language fit"],
        weaknesses: ["Competitive program"],
        expert_commentary: "This program aligns well with your goals.",
        tuition_info: "Estimated 1500 EUR/year",
        tags: admissionProb > 80 ? "SAFE" : admissionProb > 50 ? "TARGET" : "REACH"
      };

      return {
        matchRunId: matchRun.id,
        programId: prog.id,
        similarityScore: prog.similarity * 100,
        preScore,
        llmScore,
        finalScore,
        llmJson
      };
    });

    await prisma.matchResult.createMany({
        data: resultsToCreate
    });

    return NextResponse.json({ runId: matchRun.id, count: resultsToCreate.length });

  } catch (error) {
    console.error("Match Run Error:", error);
    return NextResponse.json({ error: "Matching failed" }, { status: 500 });
  }
}
