import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { parsePdf } from '@/lib/pdf-parser'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as 'CV' | 'TRANSCRIPT' | null

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 }
      )
    }

    if (!['CV', 'TRANSCRIPT'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${process.env.MAX_FILE_SIZE_MB || '10'}MB limit` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse PDF
    const parsedData = await parsePdf(buffer)

    // Save document record
    const document = await prisma.document.upsert({
      where: {
        id: `${user.id}-${type}`, // Use a deterministic ID for upsert
      },
      update: {
        filename: file.name,
        url: `/uploads/${user.id}/${type.toLowerCase()}.pdf`,
        extractedText: parsedData.text,
        parsedData: parsedData.extractedFields as object,
        parseStatus: 'COMPLETED',
        updatedAt: new Date(),
      },
      create: {
        id: `${user.id}-${type}`,
        userId: user.id,
        type: type,
        filename: file.name,
        url: `/uploads/${user.id}/${type.toLowerCase()}.pdf`,
        extractedText: parsedData.text,
        parsedData: parsedData.extractedFields as object,
        parseStatus: 'COMPLETED',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        documentId: document.id,
        extractedFields: parsedData.extractedFields,
        confidence: parsedData.confidence,
        numPages: parsedData.numPages,
      },
    })
  } catch (error) {
    console.error('Document parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse document' },
      { status: 500 }
    )
  }
}
