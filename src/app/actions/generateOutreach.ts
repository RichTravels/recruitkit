"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getClientErrorMessage, logServerError } from "@/lib/errors";
import { createGpt4oCompletion, OUTREACH_PROMPT } from "@/lib/openai";
import { FIELD_LIMITS, validateMaxLength } from "@/lib/validation";
import type { GenerateOutreachState, OutreachTone } from "./generateOutreach.types";

const VALID_TONES: OutreachTone[] = ["professional", "conversational", "direct"];

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") return value.trim();
  return "";
}

function parseOutreachResponse(raw: string) {
  const linkedinMatch = raw.match(/LINKEDIN DM:\s*([\s\S]*?)(?=EMAIL SUBJECT:|$)/i);
  const subjectMatch = raw.match(/EMAIL SUBJECT:\s*([\s\S]*?)(?=EMAIL BODY:|$)/i);
  const bodyMatch = raw.match(/EMAIL BODY:\s*([\s\S]*?)$/i);

  const linkedinDm = (linkedinMatch?.[1] ?? "").trim().slice(0, 300);
  const coldEmailSubject = (subjectMatch?.[1] ?? "").trim().slice(0, 50);
  const coldEmailBody = (bodyMatch?.[1] ?? "").trim();

  if (!linkedinDm || !coldEmailSubject || !coldEmailBody) {
    return null;
  }

  return { linkedinDm, coldEmailSubject, coldEmailBody };
}

export async function generateOutreach(
  _prevState: GenerateOutreachState,
  formData: FormData
): Promise<GenerateOutreachState> {
  try {
    const { userId: activeId } = await auth();
    if (!activeId) return { error: "Not authenticated" };

    const u = await db.user.findUnique({ where: { clerkId: activeId } });
    if (!u) return { error: "User not found" };
    if (!u.isPro && u.outreachQuota <= 0) {
      return {
        error:
          "You've used all 3 free outreach generations. Upgrade to continue.",
      };
    }

    const roleTitle = getStringField(formData, "roleTitle");
    const companyName = getStringField(formData, "companyName");
    const keySkills = getStringField(formData, "keySkills");
    const tone = getStringField(formData, "tone") as OutreachTone;
    const additionalContext = getStringField(formData, "additionalContext");

    if (!roleTitle) return { error: "Role title is required" };
    if (!companyName) return { error: "Company name is required" };
    if (!keySkills) return { error: "Key skills are required" };
    if (!VALID_TONES.includes(tone)) return { error: "Invalid tone selected" };

    const validationErrors = [
      validateMaxLength(roleTitle, FIELD_LIMITS.title, "Role title"),
      validateMaxLength(companyName, FIELD_LIMITS.companyName, "Company name"),
      validateMaxLength(keySkills, FIELD_LIMITS.keySkills, "Key skills"),
      validateMaxLength(
        additionalContext,
        FIELD_LIMITS.additionalContext,
        "Additional context"
      ),
    ].filter(Boolean);

    if (validationErrors.length > 0) {
      return { error: validationErrors[0]! };
    }

    const chat = await createGpt4oCompletion(
      OUTREACH_PROMPT(roleTitle, companyName, keySkills, tone, additionalContext)
    );

    const raw = chat.choices[0].message.content || "";
    const parsed = parseOutreachResponse(raw);
    if (!parsed) {
      return { error: "Couldn't parse the outreach response. Please try again." };
    }
    const { linkedinDm, coldEmailSubject, coldEmailBody } = parsed;

    await db.outreachMessage.create({
      data: {
        userId: u.id,
        roleTitle,
        companyName,
        keySkills,
        tone,
        linkedinDm,
        coldEmailSubject,
        coldEmailBody,
      },
    });

    if (!u.isPro) {
      await db.user.update({
        where: { clerkId: activeId },
        data: { outreachQuota: { decrement: 1 } },
      });
    }

    revalidatePath("/outreach/generate");
    revalidatePath("/outreach/library");

    return {
      roleTitle,
      companyName,
      tone,
      linkedinDm,
      coldEmailSubject,
      coldEmailBody,
    };
  } catch (error) {
    logServerError("generateOutreach", error);
    return { error: getClientErrorMessage(error, "Generation failed") };
  }
}
