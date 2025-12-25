import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const STAGE_1_5_PROMPT = (
  title: string, 
  loc: string, 
  type: string, 
  must: string[], 
  nice: string[], 
  tone: string
) => `
Write a professional, inclusive, and high-performance Job Description for the following role:
Role: ${title}
Location: ${loc}
Employment Type: ${type}
Must-haves: ${must.join(", ")}
Nice-to-haves: ${nice.join(", ")}
Brand Tone: ${tone}

Structure the response with these sections:
1. Role Mission (A 2-3 sentence hook)
2. Key Outcomes (What success looks like in 6 months)
3. Core Competencies (Skills needed)
4. Why Join Us (Perks and culture)

Use gender-neutral, bias-aware language throughout. Format in clean Markdown.
`;