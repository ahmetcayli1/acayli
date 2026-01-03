import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileSchema = z.object({
  mode: z.enum(['BACHELOR', 'MASTER']),
  personalJson: z.any().optional(),
  educationJson: z.any().optional(),
  testsJson: z.any().optional(),
  languagesJson: z.any().optional(),
  experiencesJson: z.any().optional(),
  projectsJson: z.any().optional(),
  goalsJson: z.any().optional(),
  prefsJson: z.any().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = profileSchema.parse(body)

    // Find existing profile or create new one
    const existingProfile = await prisma.profile.findFirst({
      where: {
        userId: session.user.id,
        mode: validated.mode,
      },
    })

    let profile

    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          ...validated,
          updatedAt: new Date(),
        },
      })
    } else {
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          ...validated,
        },
      })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile POST error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
