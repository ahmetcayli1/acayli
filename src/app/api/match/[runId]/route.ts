import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { ENTITLEMENT_TYPES, RESULTS_LIMITS } from '@/lib/constants'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { runId } = await params

    // Get match run with results
    const matchRun = await prisma.matchRun.findFirst({
      where: {
        id: runId,
        userId: user.id,
      },
      include: {
        results: {
          orderBy: { rank: 'asc' },
          include: {
            program: true,
          },
        },
      },
    })

    if (!matchRun) {
      return NextResponse.json({ error: 'Match run not found' }, { status: 404 })
    }

    // Check if user has entitlement
    const entitlement = await prisma.entitlement.findFirst({
      where: {
        userId: user.id,
        type: ENTITLEMENT_TYPES.FULL_RESULTS_UNLOCK,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })

    const hasFullAccess = !!entitlement

    // Format results
    const results = matchRun.results.map((result, index) => ({
      id: result.id,
      rank: result.rank,
      programId: result.programId,
      universityName: result.program.universityName,
      programName: result.program.programName,
      country: result.program.country,
      language: result.program.language,
      description: result.program.description,
      similarityScore: result.similarityScore,
      preScore: result.preScore,
      llmScore: result.llmScore,
      finalScore: result.finalScore,
      llmAnalysis: result.llmJson,
      // Lock content beyond preview limit if no entitlement
      isLocked: !hasFullAccess && index >= RESULTS_LIMITS.previewCount,
    }))

    return NextResponse.json({
      success: true,
      data: {
        matchRun: {
          id: matchRun.id,
          status: matchRun.status,
          selectedCountries: matchRun.selectedCountries,
          selectedLanguages: matchRun.selectedLanguages,
          requestedCount: matchRun.requestedCount,
          createdAt: matchRun.createdAt,
          completedAt: matchRun.completedAt,
        },
        results,
        totalCount: results.length,
        previewCount: RESULTS_LIMITS.previewCount,
        hasFullAccess,
      },
    })
  } catch (error) {
    console.error('Get match run error:', error)
    return NextResponse.json(
      { error: 'Failed to get match run' },
      { status: 500 }
    )
  }
}
