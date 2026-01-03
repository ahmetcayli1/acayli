import pdf from 'pdf-parse'

interface ParsedPdfData {
  text: string
  numPages: number
  extractedFields: {
    name?: string
    email?: string
    phone?: string
    university?: string
    degree?: string
    gpa?: number
    graduationYear?: number
    skills?: string[]
    languages?: string[]
  }
  confidence: number
}

// Email regex
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Phone regex (international format)
const PHONE_REGEX = /(\+?[\d\s\-\(\)]{10,})/g

// GPA regex (e.g., 3.5, 3.5/4.0, 85%, etc.)
const GPA_REGEX = /(?:GPA|CGPA|Grade)[:\s]*(\d+\.?\d*)\s*(?:\/\s*\d+\.?\d*)?|\b(\d+\.?\d*)\s*(?:\/\s*4\.?\d*|%)/gi

// Year regex (1990-2030)
const YEAR_REGEX = /\b(19[89]\d|20[0-3]\d)\b/g

// Common university keywords
const UNIVERSITY_KEYWORDS = [
  'university', 'college', 'institute', 'school',
  'università', 'universität', 'universidad', 'uniwersytet',
  'academy', 'polytechnic', 'hochschule',
]

// Common degree keywords
const DEGREE_KEYWORDS = [
  'bachelor', 'master', 'phd', 'doctorate', 'mba', 'msc', 'bsc',
  'ba', 'bs', 'ma', 'ms', 'engineering', 'science', 'arts',
]

// Common skills
const COMMON_SKILLS = [
  'python', 'javascript', 'java', 'c++', 'sql', 'react', 'node.js',
  'machine learning', 'data science', 'ai', 'deep learning',
  'project management', 'leadership', 'communication',
  'excel', 'powerpoint', 'word', 'photoshop',
]

// Languages
const LANGUAGES = [
  'english', 'german', 'french', 'spanish', 'italian', 'polish',
  'chinese', 'japanese', 'korean', 'arabic', 'russian', 'portuguese',
  'dutch', 'turkish', 'hindi',
]

function extractEmails(text: string): string[] {
  return text.match(EMAIL_REGEX) || []
}

function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_REGEX) || []
  return matches.map(m => m.trim()).filter(m => m.length >= 10)
}

function extractGPA(text: string): number | undefined {
  const matches = text.match(GPA_REGEX)
  if (!matches) return undefined
  
  for (const matchStr of matches) {
    // Extract number from match
    const numMatch = matchStr.match(/(\d+\.?\d*)/)
    if (numMatch) {
      const value = parseFloat(numMatch[1])
      if (value > 0 && value <= 100) {
        if (value <= 4.0) return value
        if (value <= 100) return value / 25 // Convert percentage to 4.0 scale
      }
    }
  }
  return undefined
}

function extractYears(text: string): number[] {
  const matches = text.match(YEAR_REGEX) || []
  return matches.map(m => parseInt(m)).filter(y => y >= 1990 && y <= 2030)
}

function extractUniversity(text: string): string | undefined {
  const lines = text.split('\n')
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    for (const keyword of UNIVERSITY_KEYWORDS) {
      if (lowerLine.includes(keyword)) {
        return line.trim()
      }
    }
  }
  return undefined
}

function extractDegree(text: string): string | undefined {
  const lines = text.split('\n')
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    for (const keyword of DEGREE_KEYWORDS) {
      if (lowerLine.includes(keyword)) {
        return line.trim()
      }
    }
  }
  return undefined
}

function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase()
  return COMMON_SKILLS.filter(skill => lowerText.includes(skill))
}

function extractLanguages(text: string): string[] {
  const lowerText = text.toLowerCase()
  return LANGUAGES.filter(lang => lowerText.includes(lang))
}

function extractName(text: string): string | undefined {
  // Try to find name from first few lines
  const lines = text.split('\n').slice(0, 10)
  
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip if it's an email, phone, or too short/long
    if (
      trimmed.length >= 3 &&
      trimmed.length <= 50 &&
      !trimmed.includes('@') &&
      !trimmed.match(/^\d+/) &&
      !trimmed.toLowerCase().includes('resume') &&
      !trimmed.toLowerCase().includes('cv') &&
      !trimmed.toLowerCase().includes('curriculum')
    ) {
      // Check if it looks like a name (1-3 words, each starting with capital)
      const words = trimmed.split(/\s+/)
      if (
        words.length >= 1 &&
        words.length <= 4 &&
        words.every(w => /^[A-Z]/.test(w))
      ) {
        return trimmed
      }
    }
  }
  
  return undefined
}

export async function parsePdf(buffer: Buffer): Promise<ParsedPdfData> {
  const data = await pdf(buffer)
  const text = data.text
  
  const emails = extractEmails(text)
  const phones = extractPhones(text)
  const gpa = extractGPA(text)
  const years = extractYears(text)
  const university = extractUniversity(text)
  const degree = extractDegree(text)
  const skills = extractSkills(text)
  const languages = extractLanguages(text)
  const name = extractName(text)
  
  // Calculate confidence based on how many fields we extracted
  let confidence = 0
  if (emails.length > 0) confidence += 15
  if (phones.length > 0) confidence += 10
  if (gpa !== undefined) confidence += 15
  if (years.length > 0) confidence += 10
  if (university) confidence += 15
  if (degree) confidence += 15
  if (skills.length > 0) confidence += 10
  if (name) confidence += 10
  
  return {
    text: text.substring(0, 10000), // Limit text size
    numPages: data.numpages,
    extractedFields: {
      name,
      email: emails[0],
      phone: phones[0],
      university,
      degree,
      gpa,
      graduationYear: years.length > 0 ? Math.max(...years) : undefined,
      skills,
      languages,
    },
    confidence,
  }
}
