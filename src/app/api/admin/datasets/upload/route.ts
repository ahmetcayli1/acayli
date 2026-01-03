import { NextRequest, NextResponse } from 'next/server'
import { DegreeLevel } from '@prisma/client'
import { requireAdmin } from '@/lib/session'
import { importProgramsFromExcel } from '@/lib/excel'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const country = formData.get('country') as string
    const degreeLevel = formData.get('degreeLevel') as DegreeLevel
    const mode = (formData.get('mode') as 'replace' | 'append') || 'append'

    if (!file || !country || !degreeLevel) {
      return NextResponse.json(
        { error: 'File, country, and degreeLevel are required' },
        { status: 400 }
      )
    }

    // Validate degreeLevel
    if (!['BACHELOR', 'MASTER'].includes(degreeLevel)) {
      return NextResponse.json(
        { error: 'Invalid degreeLevel. Must be BACHELOR or MASTER' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await importProgramsFromExcel(buffer, country, degreeLevel, mode)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Imported ${result.imported} programs, skipped ${result.skipped}`,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Dataset upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload dataset' },
      { status: 500 }
    )
  }
}
