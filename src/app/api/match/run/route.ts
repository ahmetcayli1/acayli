import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { runMatchingPipeline } from '@/lib/matching'

const matchRunSchema = z.object({
  profileId: z.string(),
  selectedCountries: z.array(z.string()).min(1),
  selectedLanguages: z.array(z.string()).min(1),
  requestedCount: z.number().min(10).max(50).default(20),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = matchRunSchema.parse(body)

    // Verify profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: {
        id: validatedData.profileId,
        userId: user.id,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Run matching pipeline
    const { matchRunId, results } = await runMatchingPipeline({
      profileId: profile.id,
      selectedCountries: validatedData.selectedCountries,
      selectedLanguages: validatedData.selectedLanguages,
      requestedCount: validatedData.requestedCount,
      mode: profile.mode,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: matchRunId,
        resultsCount: results.length,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Match run error:', error)
    return NextResponse.json(
      { error: 'Failed to run matching' },
      { status: 500 }
    )
  }
}
