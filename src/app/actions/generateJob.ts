"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { openai, STAGE_1_5_PROMPT } from "@/lib/openai";
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
    if (u.subscriptionStatus !== "active" && u.jdQuota <= 0) {
      return { error: "Quota exceeded" };
    }

    const { title, tone, location, employment, must, nice } = parseJobForm(formData);

    if (!title) return { error: "Role title is required" };
    if (!tone) return { error: "Brand tone is required" };

    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: STAGE_1_5_PROMPT(title, location, employment, must, nice, tone),
      }],
    });

    const content = (chat.choices[0].message.content || "") + EEOC_FOOTER;

    await db.job.create({
      data: { userId: u.id, title, content, tone },
    });

    if (u.subscriptionStatus !== "active") {
      await db.user.update({
        where: { clerkId: activeId },
        data: { jdQuota: { decrement: 1 } },
      });
    }

    revalidatePath("/");
    return { content, title, tone };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return { error: message };
  }
}
