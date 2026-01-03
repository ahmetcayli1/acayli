import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);

    // Mock extraction logic (Regex or LLM would go here)
    const text = data.text;
    
    // Simple suggestions based on keywords
    const suggestions: any = {};
    if (text.match(/GPA\s*:?\s*(\d\.\d+)/i)) {
      suggestions.gpa = text.match(/GPA\s*:?\s*(\d\.\d+)/i)?.[1];
    }
    if (text.match(/TOEFL\s*:?\s*(\d+)/i)) {
      suggestions.toefl = text.match(/TOEFL\s*:?\s*(\d+)/i)?.[1];
    }

    return NextResponse.json({ 
      text: text.slice(0, 5000), // Limit text length
      suggestions 
    });
  } catch (error) {
    console.error("PDF Parse error:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
