import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
});

export async function getEmbedding(text: string): Promise<number[]> {
  if (process.env.OPENAI_API_KEY === 'sk-placeholder' || !process.env.OPENAI_API_KEY) {
    // Return random vector of size 1536 for development/mock
    return Array.from({ length: 1536 }, () => Math.random());
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // or ada-002
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Fallback to random for robustness in dev without crashing
    return Array.from({ length: 1536 }, () => Math.random());
  }
}
