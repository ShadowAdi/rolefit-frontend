export type CoverLetterTemplateId = "classic" | "bold" | "minimal";

export interface CoverLetterTemplate {
  id: CoverLetterTemplateId | string;
  name: string;
  description: string;
}

export interface CoverLetterTemplatesResponse {
  templates: CoverLetterTemplate[];
}

export interface CoverLetterPdfStatusResponse {
  task_id: string;
  status: string;
  result: unknown | null;
}

export interface CoverLetterCandidate {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string | null;
}

export interface CoverLetterCompany {
  name?: string;
  role?: string;
}

export interface CoverLetterParagraphs {
  opening?: string;
  body1?: string;
  body2?: string;
  closing?: string;
}

export interface CoverLetterData {
  candidate: CoverLetterCandidate;
  company: CoverLetterCompany;
  date?: string;
  paragraphs: CoverLetterParagraphs;
  sign_off?: string;
}
