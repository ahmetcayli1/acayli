import prisma from './prisma'
import { DegreeLevel } from '@prisma/client'
import { MATCH_WEIGHTS } from './constants'
import type { LLMAnalysis, MatchResultData } from '@/types'

interface MatchingInput {
  profileId: string
  selectedCountries: string[]
  selectedLanguages: string[]
  requestedCount: number
  mode: DegreeLevel
}

interface ProgramWithScores {
  id: string
  universityName: string
  programName: string
  country: string
  language: string
  description: string | null
  keywords: string[]
  similarityScore: number
  preScore: number
  llmScore: number
  finalScore: number
  llmAnalysis?: LLMAnalysis
}

// Stage 1: Country + Degree filter
async function filterByCountryAndDegree(
  countries: string[],
  degreeLevel: DegreeLevel
) {
  return prisma.program.findMany({
    where: {
      country: { in: countries },
      degreeLevel: degreeLevel,
    },
  })
}

// Stage 2: Language filter
function filterByLanguage(
  programs: Awaited<ReturnType<typeof filterByCountryAndDegree>>,
  languages: string[]
) {
  return programs.filter(p => languages.includes(p.language))
}

// Stage 3: Calculate similarity score (simplified without embeddings for MVP)
function calculateSimilarityScore(
  program: { programName: string; universityName: string; keywords: string[] },
  userInterests?: string[]
): number {
  // Simple keyword matching for MVP
  // In production, this would use vector embeddings
  const programText = `${program.programName} ${program.universityName} ${program.keywords.join(' ')}`.toLowerCase()
  
  if (!userInterests || userInterests.length === 0) {
    return 50 + Math.random() * 30 // Base score with some variance
  }

  let matches = 0
  for (const interest of userInterests) {
    if (programText.includes(interest.toLowerCase())) {
      matches++
    }
  }

  const matchRatio = matches / userInterests.length
  return Math.min(100, 40 + matchRatio * 60)
}

// Stage 4: Rule-based pre-scoring
function calculatePreScore(program: {
  rankingQs: number | null
  tuitionInfo: string | null
}): number {
  let score = 50

  // Ranking bonus
  if (program.rankingQs) {
    if (program.rankingQs <= 100) score += 30
    else if (program.rankingQs <= 200) score += 20
    else if (program.rankingQs <= 500) score += 10
  }

  // Tuition info available bonus
  if (program.tuitionInfo) {
    score += 5
    // Lower tuition bonus (simplified)
    if (program.tuitionInfo.includes('0') || program.tuitionInfo.toLowerCase().includes('free')) {
      score += 10
    }
  }

  return Math.min(100, score)
}

// Stage 5: LLM evaluation (simplified for MVP without actual API call)
function generateLLMAnalysis(program: {
  universityName: string
  programName: string
  country: string
  rankingQs: number | null
  tuitionInfo: string | null
}): LLMAnalysis {
  // In production, this would call OpenAI or similar
  const admissionProbability = 40 + Math.random() * 50

  let tag: 'SAFE' | 'TARGET' | 'REACH'
  if (admissionProbability >= 70) tag = 'SAFE'
  else if (admissionProbability >= 50) tag = 'TARGET'
  else tag = 'REACH'

  return {
    admissionProbability: Math.round(admissionProbability),
    strengths: [
      'Strong academic reputation',
      'Good career prospects',
      'International environment',
    ].slice(0, 1 + Math.floor(Math.random() * 2)),
    weaknesses: [
      'Competitive admission',
      'High living costs',
    ].slice(0, Math.floor(Math.random() * 2)),
    expertCommentary: `${program.universityName}'s ${program.programName} program offers excellent opportunities for international students. The program is well-regarded in the field and provides strong career preparation.`,
    cityInsights: `Located in ${program.country}, offering rich cultural experiences and networking opportunities.`,
    tuitionInfo: program.tuitionInfo || 'Contact university for details',
    rankingQs: program.rankingQs,
    tag,
  }
}

// Stage 6: Calculate final score and rank
function calculateFinalScore(
  similarityScore: number,
  preScore: number,
  llmScore: number
): number {
  return (
    MATCH_WEIGHTS.similarity * similarityScore +
    MATCH_WEIGHTS.preScore * preScore +
    MATCH_WEIGHTS.llmScore * llmScore
  )
}

export async function runMatchingPipeline(input: MatchingInput): Promise<{
  matchRunId: string
  results: MatchResultData[]
}> {
  // Create match run record
  const matchRun = await prisma.matchRun.create({
    data: {
      userId: input.profileId, // This should be from the profile
      profileId: input.profileId,
      selectedCountries: input.selectedCountries,
      selectedLanguages: input.selectedLanguages,
      requestedCount: input.requestedCount,
      status: 'PROCESSING',
    },
  })

  try {
    // Get profile to find userId
    const profile = await prisma.profile.findUnique({
      where: { id: input.profileId },
    })

    if (!profile) {
      throw new Error('Profile not found')
    }

    // Update matchRun with correct userId
    await prisma.matchRun.update({
      where: { id: matchRun.id },
      data: { userId: profile.userId },
    })

    // Stage 1: Filter by country and degree
    let programs = await filterByCountryAndDegree(input.selectedCountries, input.mode)

    // Stage 2: Filter by language
    programs = filterByLanguage(programs, input.selectedLanguages)

    if (programs.length === 0) {
      await prisma.matchRun.update({
        where: { id: matchRun.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      })
      return { matchRunId: matchRun.id, results: [] }
    }

    // Get user interests from profile goals
    const goals = profile.goalsJson as { targetFields?: string[] } | null
    const userInterests = goals?.targetFields || []

    // Process each program through stages 3-5
    const scoredPrograms: ProgramWithScores[] = programs.map(program => {
      const similarityScore = calculateSimilarityScore(
        { programName: program.programName, universityName: program.universityName, keywords: program.keywords },
        userInterests
      )
      const preScore = calculatePreScore({
        rankingQs: program.rankingQs,
        tuitionInfo: program.tuitionInfo,
      })
      const llmAnalysis = generateLLMAnalysis({
        universityName: program.universityName,
        programName: program.programName,
        country: program.country,
        rankingQs: program.rankingQs,
        tuitionInfo: program.tuitionInfo,
      })
      const llmScore = llmAnalysis.admissionProbability
      const finalScore = calculateFinalScore(similarityScore, preScore, llmScore)

      return {
        id: program.id,
        universityName: program.universityName,
        programName: program.programName,
        country: program.country,
        language: program.language,
        description: program.description,
        keywords: program.keywords,
        similarityScore,
        preScore,
        llmScore,
        finalScore,
        llmAnalysis,
      }
    })

    // Stage 6: Sort and limit
    const sortedPrograms = scoredPrograms
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, input.requestedCount)

    // Save results
    const results: MatchResultData[] = []
    for (let i = 0; i < sortedPrograms.length; i++) {
      const program = sortedPrograms[i]
      
      await prisma.matchResult.create({
        data: {
          matchRunId: matchRun.id,
          programId: program.id,
          similarityScore: program.similarityScore,
          preScore: program.preScore,
          llmScore: program.llmScore,
          finalScore: program.finalScore,
          llmJson: program.llmAnalysis as object,
          rank: i + 1,
        },
      })

      results.push({
        programId: program.id,
        universityName: program.universityName,
        programName: program.programName,
        country: program.country,
        language: program.language,
        similarityScore: program.similarityScore,
        preScore: program.preScore,
        llmScore: program.llmScore,
        finalScore: program.finalScore,
        rank: i + 1,
        llmAnalysis: program.llmAnalysis,
      })
    }

    // Mark as completed
    await prisma.matchRun.update({
      where: { id: matchRun.id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    })

    return { matchRunId: matchRun.id, results }
  } catch (error) {
    // Mark as failed
    await prisma.matchRun.update({
      where: { id: matchRun.id },
      data: { status: 'FAILED' },
    })
    throw error
  }
}
