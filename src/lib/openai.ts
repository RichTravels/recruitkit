import OpenAI from "openai";
import { getRequiredEnv } from "@/lib/env";

export async function createGpt4oCompletion(content: string) {
  const apiKey = getRequiredEnv("OPENAI_API_KEY");

  if (process.env.NODE_ENV === "development") {
    console.log("[openai] using key suffix:", apiKey.slice(-6));
  }

  const client = new OpenAI({ apiKey });

  try {
    return await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content,
      }],
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError && error.status === 401) {
      throw new Error(
        `OpenAI rejected the API key (suffix: ...${apiKey.slice(-4)}). ` +
          "Update OPENAI_API_KEY where this app runs and restart/redeploy."
      );
    }
    throw error;
  }
}

export const STAGE_1_5_PROMPT = (
  title: string,
  loc: string,
  type: string,
  must: string[] | undefined,
  nice: string[] | undefined,
  tone: string
) => {
  must = must ?? [];
  nice = nice ?? [];

  return `
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
};

export const OUTREACH_PROMPT = (
  roleTitle: string,
  companyName: string,
  keySkills: string,
  tone: string,
  additionalContext: string
) => `
Write candidate outreach messages for a recruiter reaching out about this role:

Role Title: ${roleTitle}
Company: ${companyName}
Key Skills: ${keySkills}
Tone: ${tone}
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Generate exactly three sections using these exact labels on their own lines:

LINKEDIN DM:
(Max 300 characters. A concise, personalized connection request or InMail.)

EMAIL SUBJECT:
(Max 50 characters. Compelling subject line.)

EMAIL BODY:
(150-250 words. Professional cold email with clear value prop and soft CTA.)

Match the ${tone} tone throughout. Use gender-neutral language. Do not include any other sections or commentary.
`;
