import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const degreeLevel = searchParams.get('degreeLevel') as 'BACHELOR' | 'MASTER' | null

    if (!country || !degreeLevel) {
      return NextResponse.json({ error: 'Country and degreeLevel required' }, { status: 400 })
    }

    const count = await prisma.program.count({
      where: {
        country,
        degreeLevel,
      },
    })

    const preview = await prisma.program.findMany({
      where: {
        country,
        degreeLevel,
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ count, preview })
  } catch (error) {
    console.error('Admin datasets GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const degreeLevel = searchParams.get('degreeLevel') as 'BACHELOR' | 'MASTER' | null

    if (!country || !degreeLevel) {
      return NextResponse.json({ error: 'Country and degreeLevel required' }, { status: 400 })
    }

    const result = await prisma.program.deleteMany({
      where: {
        country,
        degreeLevel,
      },
    })

    return NextResponse.json({ deleted: result.count })
  } catch (error) {
    console.error('Admin datasets DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
