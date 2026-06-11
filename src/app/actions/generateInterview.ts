"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createGpt4oCompletion } from "@/lib/openai";
import type { GenerateInterviewState, InterviewSeniority } from "./generateInterview.types";

const VALID_SENIORITIES: InterviewSeniority[] = ["junior", "mid", "senior"];
const VALID_COUNTS = [5, 10, 15, 20];
const VALID_CATEGORIES = ["technical", "behavioral", "situational", "culture fit", "role specific"];

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") return value.trim();
  return "";
}

function interviewPrompt(
  roleTitle: string,
  seniority: string,
  questionCount: number,
  categories: string[]
) {
  return `
Generate a structured interview question bank for the following role:

Role Title: ${roleTitle}
Seniority Level: ${seniority}
Number of Questions: ${questionCount}
Categories: ${categories.join(", ")}

Generate exactly ${questionCount} interview questions spread across the requested categories.
Format the output as follows — use these exact section labels:

For each category included, write a header like:
## [Category Name]

Then list numbered questions under it. Example:

## Technical
1. Question here?
2. Question here?

## Behavioral
3. Question here?

Calibrate the difficulty and depth to a ${seniority}-level candidate. Use inclusive, bias-free language. Do not include answers or commentary — questions only.
`.trim();
}

export async function generateInterview(
  _prevState: GenerateInterviewState,
  formData: FormData
): Promise<GenerateInterviewState> {
  try {
    const { userId: activeId } = await auth();
    if (!activeId) return { error: "Not authenticated" };

    const u = await db.user.findUnique({ where: { clerkId: activeId } });
    if (!u) return { error: "User not found" };
    if (!u.isPro && u.interviewQuota <= 0) {
      return {
        error:
          "You've used all 3 free interview question generations. Upgrade to continue.",
      };
    }

    const roleTitle = getStringField(formData, "roleTitle");
    const seniority = getStringField(formData, "seniority") as InterviewSeniority;
    const questionCountRaw = getStringField(formData, "questionCount");
    const questionCount = parseInt(questionCountRaw, 10);

    const categoryValues = formData.getAll("categories");
    const categories = categoryValues
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter((v) => VALID_CATEGORIES.includes(v));

    if (!roleTitle) return { error: "Role title is required" };
    if (!VALID_SENIORITIES.includes(seniority)) return { error: "Invalid seniority selected" };
    if (!VALID_COUNTS.includes(questionCount)) return { error: "Invalid question count" };
    if (categories.length === 0) return { error: "Select at least one category" };

    const chat = await createGpt4oCompletion(
      interviewPrompt(roleTitle, seniority, questionCount, categories)
    );

    const questions = chat.choices[0].message.content || "";
    if (!questions) {
      return { error: "No content returned from OpenAI. Please try again." };
    }

    const categoriesStr = categories.join(",");

    await db.interviewQuestion.create({
      data: {
        userId: u.id,
        roleTitle,
        seniority,
        questionCount,
        categories: categoriesStr,
        questions,
      },
    });

    if (!u.isPro) {
      await db.user.update({
        where: { clerkId: activeId },
        data: { interviewQuota: { decrement: 1 } },
      });
    }

    revalidatePath("/interview/generate");
    revalidatePath("/interview/library");

    return {
      roleTitle,
      seniority,
      questionCount,
      categories: categoriesStr,
      questions,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return { error: message };
  }
}
