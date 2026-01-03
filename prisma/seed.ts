import { PrismaClient, DegreeLevel } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

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

function normalizeLanguage(lang: string): string {
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

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@uniwise.ai'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#'

  console.log('🔐 Seeding admin user...')

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  })

  if (existingAdmin) {
    console.log('  ⚠️  Admin user already exists, skipping...')
    return
  }

  const passwordHash = await hash(adminPassword, 12)

  await prisma.user.create({
    data: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log(`  ✅ Admin user created: ${adminEmail}`)
}

async function importExcelFile(
  filePath: string,
  country: string,
  degreeLevel: DegreeLevel
): Promise<number> {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`)
    return 0
  }

  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet)

  let imported = 0
  let skipped = 0

  for (const row of data) {
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
      console.error(`  ❌ Error importing row:`, row, error)
      skipped++
    }
  }

  console.log(`  📊 ${filePath}: ${imported} imported, ${skipped} skipped`)
  return imported
}

async function seedPrograms() {
  console.log('📚 Seeding programs from Excel files...')

  const dataDir = path.join(process.cwd(), 'data')
  const countries = ['germany', 'italy', 'poland']
  const degreeLevels: { folder: string; level: DegreeLevel }[] = [
    { folder: 'master', level: 'MASTER' },
    { folder: 'bachelor', level: 'BACHELOR' },
  ]

  let totalImported = 0

  for (const { folder, level } of degreeLevels) {
    console.log(`\n  📁 Processing ${folder} programs...`)

    for (const country of countries) {
      const filePath = path.join(dataDir, folder, `${country}_${folder}.xlsx`)
      const imported = await importExcelFile(filePath, country, level)
      totalImported += imported
    }
  }

  console.log(`\n✅ Total programs imported: ${totalImported}`)
}

async function main() {
  console.log('🚀 Starting database seed...\n')

  await seedAdmin()
  await seedPrograms()

  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
