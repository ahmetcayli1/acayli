import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const matchRun = await prisma.matchRun.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        profile: true,
        results: {
          include: {
            program: true,
          },
          orderBy: {
            finalScore: 'desc',
          },
        },
      },
    })

    if (!matchRun) {
      return NextResponse.json({ error: 'Match run not found' }, { status: 404 })
    }

    return NextResponse.json({ matchRun })
  } catch (error) {
    console.error('Admin match-run GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
