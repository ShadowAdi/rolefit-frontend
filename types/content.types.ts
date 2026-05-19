import { ISODateTime, UUID } from "./common";

export enum GeneratedDocumentType {
  RESUME = "Resume",
  COVER_LETTER = "Cover-letter",
}

export enum GeneratedDocumentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface GenerateContentQuery {
  user_specifications?: string;
}

export interface GeneratedDocumentCreateResponse {
  id: UUID;
  userId: UUID;
  jobId: UUID;
  resume_text: string | null;
  cover_letter_text: string | null;
  gen_doc_type: string;
  user_specifications: string | null;
  created_at: ISODateTime;
}

export interface GeneratedDocumentResponse {
  id: UUID;
  resume_text: string | null;
  cover_letter_text: string | null;
  userId: UUID;
  jobId: UUID;
  gen_doc_type: string;
  user_specifications: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface GeneratedDocumentDeleteResponse {
  id: UUID;
  success: boolean;
  message: string;
}

export interface GeneratedDocumentStatusResponse {
  doc_id: UUID;
  status: GeneratedDocumentStatus | string;
  message?: string;
  error?: string;
}
