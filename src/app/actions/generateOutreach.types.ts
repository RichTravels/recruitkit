export type OutreachTone = "professional" | "conversational" | "direct";

export type GenerateOutreachState = {
  roleTitle?: string;
  companyName?: string;
  tone?: string;
  linkedinDm?: string;
  coldEmailSubject?: string;
  coldEmailBody?: string;
  error?: string;
};

export type DeleteOutreachState = {
  error?: string;
  success?: boolean;
};
