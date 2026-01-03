import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { prisma } from './prisma';
import { getEmbedding } from './openai';
import { DegreeLevel, Prisma } from '@prisma/client';

export async function processDataset(country: string, degreeLevel: DegreeLevel) {
  const normalizedCountry = country.toLowerCase();
  const normalizedDegree = degreeLevel.toLowerCase();
  
  const fileName = `${normalizedCountry}_${normalizedDegree}.xlsx`;
  const filePath = path.join(process.cwd(), 'data', normalizedDegree, fileName);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dataset file not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet) as any[];

  console.log(`Processing ${data.length} records for ${country} ${degreeLevel}...`);

  let processed = 0;

  for (const row of data) {
    const universityName = row['university_name']?.trim();
    const programName = row['program_name']?.trim();
    const language = row['language']?.trim(); // Normalize?

    if (!universityName || !programName || !language) continue;

    const textForEmbedding = `${programName} at ${universityName} (${language})`;
    const embedding = await getEmbedding(textForEmbedding);
    
    // Convert embedding array to string for pgvector format: "[0.1, 0.2, ...]"
    const vectorString = `[${embedding.join(',')}]`;

    // Use executeRaw because of Unsupported vector type
    // We handle Upsert logic manually via ON CONFLICT
    
    // Basic normalization for language
    let normLanguage = language.toUpperCase();
    if (normLanguage.includes('ENGLISH')) normLanguage = 'EN';
    if (normLanguage.includes('GERMAN')) normLanguage = 'DE';
    if (normLanguage.includes('ITALIAN')) normLanguage = 'IT';
    if (normLanguage.includes('POLISH')) normLanguage = 'PL';

    const id = require('crypto').randomUUID(); // generate CUID/UUID
    
    // Check if exists to get ID (Prisma doesn't return ID easily on raw upsert if we want to be safe)
    // Or just use ON CONFLICT UPDATE
    
    await prisma.$executeRaw`
      INSERT INTO "Program" (
        "id", "country", "degreeLevel", "universityName", "programName", "language", "embedding", "updatedAt"
      ) VALUES (
        ${id}, ${country}, ${degreeLevel}::"DegreeLevel", ${universityName}, ${programName}, ${normLanguage}, ${vectorString}::vector, NOW()
      )
      ON CONFLICT ("country", "degreeLevel", "universityName", "programName", "language")
      DO UPDATE SET
        "embedding" = ${vectorString}::vector,
        "updatedAt" = NOW()
    `;
    
    processed++;
  }
  
  return processed;
}

export async function deleteDataset(country: string, degreeLevel: DegreeLevel) {
  return await prisma.program.deleteMany({
    where: {
      country: country,
      degreeLevel: degreeLevel
    }
  });
}
