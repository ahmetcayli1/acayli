import { prisma } from './prisma'
import { generateEmbedding, generateProgramAnalysis } from './openai'

interface MatchingProfile {
  mode: 'BACHELOR' | 'MASTER'
  selectedCountries: string[]
  selectedLanguages: string[]
  requestedCount: number
  personalJson?: any
  educationJson?: any
  testsJson?: any
  experiencesJson?: any
  goalsJson?: any
}

interface MatchingWeights {
  similarity: number
  preScore: number
  llmScore: number
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  similarity: 0.4,
  preScore: 0.2,
  llmScore: 0.4,
}

// Stage 1: Country + Degree Filter
async function filterByCountryAndDegree(
  countries: string[],
  degreeLevel: 'BACHELOR' | 'MASTER'
) {
  return await prisma.program.findMany({
    where: {
      country: { in: countries },
      degreeLevel,
    },
  })
}

// Stage 2: Language Filter
function filterByLanguage(programs: any[], languages: string[]) {
  return programs.filter(p => languages.includes(p.language))
}

// Stage 3: Semantic Similarity
async function calculateSemanticSimilarity(
  userProfile: MatchingProfile,
  programs: any[]
) {
  // Generate user embedding from interests and background
  const userText = [
    userProfile.goalsJson?.motivation || '',
    userProfile.goalsJson?.targetFields?.join(' ') || '',
    userProfile.educationJson?.major || '',
    userProfile.educationJson?.minor || '',
  ].join(' ')

  const userEmbedding = await generateEmbedding(userText)

  const results = []

  for (const program of programs) {
    if (!program.embedding) {
      results.push({ program, similarityScore: 50 })
      continue
    }

    // Calculate cosine similarity
    const similarity = cosineSimilarity(
      userEmbedding,
      program.embedding as number[]
    )
    
    // Convert to 0-100 scale
    const similarityScore = Math.max(0, Math.min(100, (similarity + 1) * 50))

    results.push({ program, similarityScore })
  }

  return results
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Stage 4: Quick Pre-evaluation (Rule-based)
function calculatePreScore(userProfile: MatchingProfile, program: any): number {
  let score = 50 // baseline

  // GPA evaluation
  const gpa = userProfile.educationJson?.gpa
  if (gpa) {
    const normalizedGpa = userProfile.educationJson?.gpaScale === '100' 
      ? gpa / 25 
      : gpa
    
    if (normalizedGpa >= 3.5) score += 20
    else if (normalizedGpa >= 3.0) score += 10
    else if (normalizedGpa >= 2.5) score += 5
    else score -= 10
  }

  // Test scores (simplified)
  const tests = userProfile.testsJson
  if (tests) {
    if (tests.toefl >= 100 || tests.ielts >= 7.0) score += 10
    if (tests.gre >= 320 || tests.gmat >= 650) score += 10
  }

  // Experience
  const experienceYears = userProfile.experiencesJson?.reduce(
    (sum: number, exp: any) => sum + (exp.duration || 0),
    0
  ) || 0
  
  if (userProfile.mode === 'MASTER' && experienceYears >= 2) score += 10
  if (userProfile.mode === 'BACHELOR' && experienceYears >= 1) score += 5

  return Math.max(0, Math.min(100, score))
}

// Stage 5: LLM Evaluation
async function evaluateWithLLM(
  userProfile: MatchingProfile,
  programs: any[],
  topN: number = 50
): Promise<any[]> {
  const results = []

  for (const programData of programs.slice(0, topN)) {
    try {
      const analysis = await generateProgramAnalysis(userProfile, programData.program)
      
      results.push({
        ...programData,
        llmScore: analysis.admission_probability,
        llmJson: analysis,
      })

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('LLM evaluation error:', error)
      results.push({
        ...programData,
        llmScore: 50,
        llmJson: {
          admission_probability: 50,
          strengths: [],
          weaknesses: [],
          expert_commentary: 'Analysis unavailable',
          city_insights: '',
          tuition_info: 'Contact university',
          ranking: 'Not ranked',
          tag: 'TARGET',
        },
      })
    }
  }

  return results
}

// Stage 6: Final Ranking
function calculateFinalScore(
  similarityScore: number,
  preScore: number,
  llmScore: number,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): number {
  return (
    weights.similarity * similarityScore +
    weights.preScore * preScore +
    weights.llmScore * llmScore
  )
}

// Main matching pipeline
export async function runMatchingPipeline(
  userId: string,
  profileId: string,
  userProfile: MatchingProfile
) {
  console.log('🎯 Starting matching pipeline...')

  // Stage 1: Country + Degree Filter
  console.log('Stage 1: Filtering by country and degree...')
  const filteredByCountry = await filterByCountryAndDegree(
    userProfile.selectedCountries,
    userProfile.mode
  )
  console.log(`Found ${filteredByCountry.length} programs`)

  // Stage 2: Language Filter
  console.log('Stage 2: Filtering by language...')
  const filteredByLanguage = filterByLanguage(
    filteredByCountry,
    userProfile.selectedLanguages
  )
  console.log(`Found ${filteredByLanguage.length} programs after language filter`)

  if (filteredByLanguage.length === 0) {
    throw new Error('No programs found matching your criteria')
  }

  // Stage 3: Semantic Similarity
  console.log('Stage 3: Calculating semantic similarity...')
  const withSimilarity = await calculateSemanticSimilarity(
    userProfile,
    filteredByLanguage
  )

  // Stage 4: Pre-evaluation
  console.log('Stage 4: Running quick pre-evaluation...')
  const withPreScore = withSimilarity.map(item => ({
    ...item,
    preScore: calculatePreScore(userProfile, item.program),
  }))

  // Sort by combined preliminary score and take top candidates for LLM
  const preliminaryScore = withPreScore.map(item => ({
    ...item,
    prelimScore: item.similarityScore * 0.6 + item.preScore * 0.4,
  }))
  
  preliminaryScore.sort((a, b) => b.prelimScore - a.prelimScore)

  // Stage 5: LLM Evaluation on top candidates
  console.log('Stage 5: Running LLM evaluation...')
  const topCandidates = Math.min(
    userProfile.requestedCount * 2,
    preliminaryScore.length
  )
  const withLLMScores = await evaluateWithLLM(
    userProfile,
    preliminaryScore,
    topCandidates
  )

  // Stage 6: Final Ranking
  console.log('Stage 6: Calculating final scores and ranking...')
  const finalResults = withLLMScores.map(item => ({
    ...item,
    finalScore: calculateFinalScore(
      item.similarityScore,
      item.preScore,
      item.llmScore
    ),
  }))

  finalResults.sort((a, b) => b.finalScore - a.finalScore)

  // Take requested count
  const topResults = finalResults.slice(0, userProfile.requestedCount)

  // Save to database
  console.log('Saving match run to database...')
  const matchRun = await prisma.matchRun.create({
    data: {
      userId,
      profileId,
      selectedCountries: userProfile.selectedCountries,
      selectedLanguages: userProfile.selectedLanguages,
      requestedCount: userProfile.requestedCount,
      results: {
        create: topResults.map(result => ({
          programId: result.program.id,
          similarityScore: result.similarityScore,
          preScore: result.preScore,
          llmScore: result.llmScore,
          finalScore: result.finalScore,
          llmJson: result.llmJson,
        })),
      },
    },
    include: {
      results: {
        include: {
          program: true,
        },
      },
    },
  })

  console.log('✅ Matching pipeline completed!')
  return matchRun
}
