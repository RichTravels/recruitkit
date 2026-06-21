export const FIELD_LIMITS = {
  title: 200,
  location: 200,
  companyName: 200,
  keySkills: 2000,
  additionalContext: 2000,
  listItem: 200,
  listMaxItems: 50,
} as const;

export const JOB_TONES = ["professional", "friendly", "bold", "inclusive"] as const;
export type JobTone = (typeof JOB_TONES)[number];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"] as const;

export function maxLengthError(label: string, max: number): string {
  return `${label} must be ${max} characters or fewer`;
}

export function validateMaxLength(
  value: string,
  max: number,
  label: string
): string | null {
  if (value.length > max) return maxLengthError(label, max);
  return null;
}

export function validateStringList(
  items: string[],
  label: string
): string | null {
  if (items.length > FIELD_LIMITS.listMaxItems) {
    return `${label} must have ${FIELD_LIMITS.listMaxItems} items or fewer`;
  }

  for (const item of items) {
    if (item.length > FIELD_LIMITS.listItem) {
      return maxLengthError(`Each ${label.toLowerCase()} item`, FIELD_LIMITS.listItem);
    }
  }

  return null;
}
