import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

export async function generateProgramAnalysis(
  userProfile: any,
  program: any
): Promise<{
  admission_probability: number
  strengths: string[]
  weaknesses: string[]
  expert_commentary: string
  city_insights: string
  tuition_info: string
  ranking: string
  tag: 'SAFE' | 'TARGET' | 'REACH'
}> {
  const prompt = `You are an expert university admissions consultant. Analyze this student's profile against the program and provide a strict JSON response.

Student Profile:
- Mode: ${userProfile.mode}
- GPA: ${userProfile.educationJson?.gpa || 'N/A'}
- Test Scores: ${JSON.stringify(userProfile.testsJson || {})}
- Experience: ${JSON.stringify(userProfile.experiencesJson || {})}
- Goals: ${JSON.stringify(userProfile.goalsJson || {})}

Program:
- University: ${program.universityName}
- Program: ${program.programName}
- Country: ${program.country}
- Language: ${program.language}

Provide analysis in this EXACT JSON format (no additional text):
{
  "admission_probability": <0-100>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "expert_commentary": "detailed analysis",
  "city_insights": "information about the city and living there",
  "tuition_info": "estimated tuition or 'Contact university'",
  "ranking": "QS ranking if known, otherwise 'Not ranked'",
  "tag": "SAFE|TARGET|REACH"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}
