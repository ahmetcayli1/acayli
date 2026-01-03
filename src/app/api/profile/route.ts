import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

const profileSchema = z.object({
  mode: z.enum(['BACHELOR', 'MASTER']),
  personal: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthYear: z.number().optional(),
    citizenship: z.string().optional(),
    residence: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
  education: z.any().optional(),
  doubleMajor: z.any().optional(),
  tests: z.any().optional(),
  experiences: z.any().optional(),
  projects: z.any().optional(),
  goals: z.any().optional(),
  preferences: z.any().optional(),
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
    const validatedData = profileSchema.parse(body)

    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        mode: validatedData.mode,
        personalJson: validatedData.personal,
        educationJson: validatedData.education,
        doubleMajorJson: validatedData.doubleMajor,
        testsJson: validatedData.tests,
        experienceJson: validatedData.experiences,
        projectsJson: validatedData.projects,
        goalsJson: validatedData.goals,
        prefsJson: validatedData.preferences,
        selectedCountries: validatedData.selectedCountries,
        selectedLanguages: validatedData.selectedLanguages,
        requestedCount: validatedData.requestedCount,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        mode: validatedData.mode,
        personalJson: validatedData.personal,
        educationJson: validatedData.education,
        doubleMajorJson: validatedData.doubleMajor,
        testsJson: validatedData.tests,
        experienceJson: validatedData.experiences,
        projectsJson: validatedData.projects,
        goalsJson: validatedData.goals,
        prefsJson: validatedData.preferences,
        selectedCountries: validatedData.selectedCountries,
        selectedLanguages: validatedData.selectedLanguages,
        requestedCount: validatedData.requestedCount,
      },
    })

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Profile error:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
