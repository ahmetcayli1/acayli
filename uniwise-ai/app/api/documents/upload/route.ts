import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import pdf from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'CV' | 'TRANSCRIPT'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse PDF
    let extractedText = ''
    try {
      const data = await pdf(buffer)
      extractedText = data.text
    } catch (error) {
      console.error('PDF parse error:', error)
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 400 })
    }

    // Save document record
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        type,
        url: `uploads/documents/${session.user.id}/${file.name}`,
        extractedText,
        parseStatus: 'COMPLETED',
      },
    })

    // Extract suggestions from text (basic implementation)
    const suggestions = extractSuggestionsFromText(extractedText, type)

    return NextResponse.json({
      document,
      suggestions,
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

function extractSuggestionsFromText(text: string, type: 'CV' | 'TRANSCRIPT') {
  const suggestions: any = {}

  // Extract email
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/
  const emailMatch = text.match(emailRegex)
  if (emailMatch) {
    suggestions.email = emailMatch[0]
  }

  // Extract phone
  const phoneRegex = /[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/
  const phoneMatch = text.match(phoneRegex)
  if (phoneMatch) {
    suggestions.phone = phoneMatch[0]
  }

  if (type === 'TRANSCRIPT') {
    // Extract GPA (simple pattern)
    const gpaRegex = /GPA[:\s]+([0-9]\.[0-9]{1,2})/i
    const gpaMatch = text.match(gpaRegex)
    if (gpaMatch) {
      suggestions.gpa = parseFloat(gpaMatch[1])
    }

    // Extract university name (look for common keywords)
    const universityKeywords = ['University', 'College', 'Institute', 'School']
    for (const keyword of universityKeywords) {
      const regex = new RegExp(`([A-Z][\\w\\s]+${keyword}[\\w\\s]*)`, 'g')
      const matches = text.match(regex)
      if (matches && matches.length > 0) {
        suggestions.universityName = matches[0].trim()
        break
      }
    }
  }

  if (type === 'CV') {
    // Extract years of experience (count year ranges)
    const yearRanges = text.match(/20\d{2}\s*[-–]\s*20\d{2}/g)
    if (yearRanges && yearRanges.length > 0) {
      suggestions.experienceYears = yearRanges.length
    }

    // Extract skills/technologies (common terms)
    const techKeywords = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Science']
    const foundSkills = techKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    )
    if (foundSkills.length > 0) {
      suggestions.skills = foundSkills
    }
  }

  return suggestions
}
