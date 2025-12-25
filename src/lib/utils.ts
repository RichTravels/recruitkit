import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This helper is used by Shadcn UI for styling
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EEOC_FOOTER = `
---
*RecruitKit is an equal opportunity platform. We encourage the generation of job descriptions that promote diversity, equity, and inclusion.*
`;