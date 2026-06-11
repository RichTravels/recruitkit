export type InterviewSeniority = "junior" | "mid" | "senior";

export type GenerateInterviewState = {
  roleTitle?: string;
  seniority?: string;
  questionCount?: number;
  categories?: string;
  questions?: string;
  error?: string;
};

export type DeleteInterviewState = {
  error?: string;
  success?: boolean;
};
