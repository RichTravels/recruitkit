"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { DeleteOutreachState } from "./generateOutreach.types";

export async function deleteOutreach(
  _prevState: DeleteOutreachState,
  formData: FormData
): Promise<DeleteOutreachState> {
  try {
    const { userId: activeId } = await auth();
    if (!activeId) return { error: "Not authenticated" };

    const u = await db.user.findUnique({ where: { clerkId: activeId } });
    if (!u) return { error: "User not found" };

    const id = formData.get("id");
    if (typeof id !== "string" || !id) return { error: "Invalid message ID" };

    const message = await db.outreachMessage.findFirst({
      where: { id, userId: u.id },
    });
    if (!message) return { error: "Message not found" };

    await db.outreachMessage.delete({ where: { id } });

    revalidatePath("/outreach/library");

    return { success: true };
  } catch (error) {
    console.error("[deleteOutreach]", error);
    const message = error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
}
