"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getClientErrorMessage, logServerError } from "@/lib/errors";
import { createGpt4oCompletion, STAGE_1_5_PROMPT } from "@/lib/openai";
import {
  EMPLOYMENT_TYPES,
  FIELD_LIMITS,
  JOB_TONES,
  type JobTone,
  validateMaxLength,
  validateStringList,
} from "@/lib/validation";
import { EEOC_FOOTER } from "@/lib/utils";
import type { GenerateJobState } from "./generateJob.types";

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value === "string") return value.trim();
  return "";
}

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJobForm(formData: FormData) {
  const fields = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ])
  );

  const title = (fields.title ?? getStringField(formData, "title")).trim();
  const tone = (fields.tone ?? (getStringField(formData, "tone") || "professional")).trim();
  const location = (fields.location ?? getStringField(formData, "location")).trim();
  const employment = (fields.employment ?? (getStringField(formData, "employment") || "Full-time")).trim();
  const must = parseList(fields.must ?? formData.get("must"));
  const nice = parseList(fields.nice ?? formData.get("nice"));

  return { title, tone, location, employment, must, nice };
}

export async function generateJob(
  _prevState: GenerateJobState,
  formData: FormData
): Promise<GenerateJobState> {
  try {
    const { userId: activeId } = await auth();
    if (!activeId) return { error: "Not authenticated" };

    const u = await db.user.findUnique({ where: { clerkId: activeId } });
    if (!u) return { error: "User not found" };
    if (!u.isPro && u.jdQuota <= 0) {
      return {
        error:
          "You've used all 3 free job description generations. Upgrade to continue.",
      };
    }

    const { title, tone, location, employment, must, nice } = parseJobForm(formData);

    if (!title) return { error: "Role title is required" };
    if (!tone) return { error: "Brand tone is required" };
    if (!JOB_TONES.includes(tone as JobTone)) return { error: "Invalid tone selected" };
    if (!EMPLOYMENT_TYPES.includes(employment as (typeof EMPLOYMENT_TYPES)[number])) {
      return { error: "Invalid employment type selected" };
    }

    const validationErrors = [
      validateMaxLength(title, FIELD_LIMITS.title, "Role title"),
      validateMaxLength(location, FIELD_LIMITS.location, "Location"),
      validateStringList(must, "Must-haves"),
      validateStringList(nice, "Nice-to-haves"),
    ].filter(Boolean);

    if (validationErrors.length > 0) {
      return { error: validationErrors[0]! };
    }

    const chat = await createGpt4oCompletion(
      STAGE_1_5_PROMPT(title, location, employment, must, nice, tone)
    );

    const content = (chat.choices[0].message.content || "") + EEOC_FOOTER;

    await db.job.create({
      data: { userId: u.id, title, content, tone },
    });

    if (!u.isPro) {
      await db.user.update({
        where: { clerkId: activeId },
        data: { jdQuota: { decrement: 1 } },
      });
    }

    revalidatePath("/dashboard");
    return { content, title, tone };
  } catch (error) {
    logServerError("generateJob", error);
    return { error: getClientErrorMessage(error, "Generation failed") };
  }
}
