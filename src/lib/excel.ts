import * as XLSX from 'xlsx'
import { DegreeLevel } from '@prisma/client'
import prisma from './prisma'

// Language normalization map
const languageMap: Record<string, string> = {
  english: 'EN',
  en: 'EN',
  german: 'DE',
  de: 'DE',
  deutsch: 'DE',
  italian: 'IT',
  it: 'IT',
  italiano: 'IT',
  polish: 'PL',
  pl: 'PL',
  polski: 'PL',
  french: 'FR',
  fr: 'FR',
  spanish: 'ES',
  es: 'ES',
  portuguese: 'PT',
  pt: 'PT',
}

export function normalizeLanguage(lang: string): string {
  const normalized = lang.toLowerCase().trim()
  return languageMap[normalized] || lang.toUpperCase().substring(0, 2)
}

interface ExcelRow {
  university_name?: string
  program_name?: string
  language?: string
  description?: string
  keywords?: string
  tuition_info?: string
  ranking_qs?: number
}

export async function parseExcelBuffer(buffer: Buffer): Promise<ExcelRow[]> {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json(worksheet)
}

export async function importProgramsFromExcel(
  buffer: Buffer,
  country: string,
  degreeLevel: DegreeLevel,
  mode: 'replace' | 'append' = 'append'
): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const rows = await parseExcelBuffer(buffer)
  
  // If replace mode, delete existing records
  if (mode === 'replace') {
    await prisma.program.deleteMany({
      where: { country, degreeLevel },
    })
  }

  let imported = 0
  let skipped = 0
  const errors: string[] = []

  for (const row of rows) {
    if (!row.university_name || !row.program_name) {
      skipped++
      continue
    }

    const language = normalizeLanguage(row.language || 'EN')

    try {
      await prisma.program.upsert({
        where: {
          country_degreeLevel_universityName_programName_language: {
            country,
            degreeLevel,
            universityName: row.university_name.trim(),
            programName: row.program_name.trim(),
            language,
          },
        },
        update: {
          description: row.description?.trim() || null,
          keywords: row.keywords ? row.keywords.split(',').map((k) => k.trim()) : [],
          tuitionInfo: row.tuition_info?.trim() || null,
          rankingQs: row.ranking_qs || null,
        },
        create: {
          country,
          degreeLevel,
          universityName: row.university_name.trim(),
          programName: row.program_name.trim(),
          language,
          description: row.description?.trim() || null,
          keywords: row.keywords ? row.keywords.split(',').map((k) => k.trim()) : [],
          tuitionInfo: row.tuition_info?.trim() || null,
          rankingQs: row.ranking_qs || null,
        },
      })
      imported++
    } catch (error) {
      const errMsg = `Error importing ${row.university_name} - ${row.program_name}: ${error}`
      errors.push(errMsg)
      skipped++
    }
  }

  return { imported, skipped, errors }
}

export async function getDatasetStats(country?: string, degreeLevel?: DegreeLevel) {
  const where: { country?: string; degreeLevel?: DegreeLevel } = {}
  if (country) where.country = country
  if (degreeLevel) where.degreeLevel = degreeLevel

  const count = await prisma.program.count({ where })
  
  const groupedStats = await prisma.program.groupBy({
    by: ['country', 'degreeLevel'],
    _count: true,
    where,
  })

  return { total: count, byCountryAndLevel: groupedStats }
}

export async function deleteDataset(country: string, degreeLevel: DegreeLevel): Promise<number> {
  const result = await prisma.program.deleteMany({
    where: { country, degreeLevel },
  })
  return result.count
}

export async function previewDataset(
  country: string,
  degreeLevel: DegreeLevel,
  limit: number = 20
) {
  return prisma.program.findMany({
    where: { country, degreeLevel },
    take: limit,
    orderBy: { universityName: 'asc' },
  })
}
