import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { runMatchingPipeline } from '@/lib/matching'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { profileId, selectedCountries, selectedLanguages, requestedCount } = body

    // Validate input
    if (!profileId || !selectedCountries?.length || !selectedLanguages?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    })

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Run matching pipeline
    const matchRun = await runMatchingPipeline(session.user.id, profileId, {
      mode: profile.mode,
      selectedCountries,
      selectedLanguages,
      requestedCount: requestedCount || 20,
      personalJson: profile.personalJson as any,
      educationJson: profile.educationJson as any,
      testsJson: profile.testsJson as any,
      experiencesJson: profile.experiencesJson as any,
      goalsJson: profile.goalsJson as any,
    })

    return NextResponse.json({ matchRun })
  } catch (error) {
    console.error('Match run error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
