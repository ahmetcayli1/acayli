import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { generateEmbedding } from '../lib/openai'
import { LANGUAGE_NORMALIZATION } from '../config/constants'

const prisma = new PrismaClient()

async function seedAdmin() {
  console.log('🔐 Seeding admin user...')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@uniwise.ai'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return existingAdmin
  }

  const passwordHash = await hashPassword(adminPassword)

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Admin user created: ${adminEmail}`)
  return admin
}

async function importExcelDataset(
  filePath: string,
  country: string,
  degreeLevel: 'BACHELOR' | 'MASTER'
) {
  console.log(`📊 Importing ${filePath}...`)

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}, skipping...`)
    return 0
  }

  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(worksheet)

  let imported = 0
  let skipped = 0

  for (const row of data as any[]) {
    try {
      const universityName = row.university_name?.toString().trim()
      const programName = row.program_name?.toString().trim()
      const languageRaw = row.language?.toString().trim().toLowerCase()

      if (!universityName || !programName || !languageRaw) {
        skipped++
        continue
      }

      // Normalize language
      const language = LANGUAGE_NORMALIZATION[languageRaw] || 
                       languageRaw.toUpperCase().substring(0, 2)

      // Generate embedding text
      const embeddingText = `${universityName} ${programName} ${language} ${country}`
      const embedding = await generateEmbedding(embeddingText)

      // Upsert program
      await prisma.$executeRaw`
        INSERT INTO "Program" (
          id, country, "degreeLevel", "universityName", "programName", language, embedding, "createdAt"
        ) VALUES (
          gen_random_uuid()::text,
          ${country},
          ${degreeLevel}::"DegreeLevel",
          ${universityName},
          ${programName},
          ${language},
          ${JSON.stringify(embedding)}::vector,
          NOW()
        )
        ON CONFLICT (country, "degreeLevel", "universityName", "programName", language)
        DO UPDATE SET
          embedding = EXCLUDED.embedding
      `

      imported++

      // Rate limiting for OpenAI API
      if (imported % 10 === 0) {
        console.log(`  Imported ${imported} programs...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`  Error importing row:`, error)
      skipped++
    }
  }

  console.log(`✅ Imported ${imported} programs, skipped ${skipped}`)
  return imported
}

async function seedDatasets() {
  console.log('📚 Seeding datasets...')

  const dataDir = path.join(process.cwd(), 'data')
  
  const datasets = [
    { file: path.join(dataDir, 'master', 'germany_master.xlsx'), country: 'DE', level: 'MASTER' as const },
    { file: path.join(dataDir, 'master', 'italy_master.xlsx'), country: 'IT', level: 'MASTER' as const },
    { file: path.join(dataDir, 'master', 'poland_master.xlsx'), country: 'PL', level: 'MASTER' as const },
    { file: path.join(dataDir, 'bachelor', 'germany_bachelor.xlsx'), country: 'DE', level: 'BACHELOR' as const },
    { file: path.join(dataDir, 'bachelor', 'italy_bachelor.xlsx'), country: 'IT', level: 'BACHELOR' as const },
    { file: path.join(dataDir, 'bachelor', 'poland_bachelor.xlsx'), country: 'PL', level: 'BACHELOR' as const },
  ]

  let totalImported = 0

  for (const dataset of datasets) {
    const count = await importExcelDataset(dataset.file, dataset.country, dataset.level)
    totalImported += count
  }

  console.log(`✅ Total programs imported: ${totalImported}`)
}

async function main() {
  console.log('🌱 Starting seed...')

  try {
    await seedAdmin()
    await seedDatasets()
    
    console.log('✅ Seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
