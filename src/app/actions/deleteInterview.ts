"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getClientErrorMessage, logServerError } from "@/lib/errors";
import type { DeleteInterviewState } from "./generateInterview.types";

export async function deleteInterview(
  _prevState: DeleteInterviewState,
  formData: FormData
): Promise<DeleteInterviewState> {
  try {
    const { userId: activeId } = await auth();
    if (!activeId) return { error: "Not authenticated" };

    const u = await db.user.findUnique({ where: { clerkId: activeId } });
    if (!u) return { error: "User not found" };

    const id = formData.get("id");
    if (typeof id !== "string" || !id) return { error: "Invalid question bank ID" };

    const record = await db.interviewQuestion.findFirst({
      where: { id, userId: u.id },
    });
    if (!record) return { error: "Question bank not found" };

    await db.interviewQuestion.deleteMany({
      where: { id, userId: u.id },
    });

    revalidatePath("/interview/library");

    return { success: true };
  } catch (error) {
    logServerError("deleteInterview", error);
    return { error: getClientErrorMessage(error, "Delete failed") };
  }
}
