export function logServerError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}

export function getClientErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return error.message;
  }
  return fallback;
}
