import { z } from "zod";
import { ISODateTime, UUID } from "./common";

export type MonthRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type AcademicLinks = Record<string, string>;

export interface AcademicBase {
  id: UUID;
  profileId: UUID;
  degree_name: string;
  college_name: string;
  description: string | null;
  links: AcademicLinks | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  priority: number | null;
  createdAt: ISODateTime;
}

export interface AcademicCreateRequest {
  degree_name: string;
  college_name: string;
  description?: string | null;
  links?: AcademicLinks | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  priority?: number | null;
}

export type AcademicCreatePayload = AcademicCreateRequest;

export interface AcademicUpdateRequest {
  degree_name?: string;
  college_name?: string;
  description?: string | null;
  links?: AcademicLinks | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  priority?: number | null;
}

export type AcademicUpdatePayload = AcademicUpdateRequest;

export interface AcademicCreateResponse {
  id: UUID;
  degree_name: string;
  college_name: string;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface AcademicGetResponse {
  id: UUID;
  degree_name: string;
  college_name: string;
  profileId: UUID;
  description: string | null;
  links: AcademicLinks | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  priority: number | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface AcademicUpdateResponse {
  id: UUID;
  degree_name: string;
  college_name: string;
  description: string | null;
  links: AcademicLinks | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  priority: number | null;
  updated_at: ISODateTime;
}

export interface AcademicListResponse {
  id: UUID;
  degree_name: string;
  college_name: string;
  profileId: UUID;
  start_year: number | null;
  end_year: number | null;
  priority: number | null;
  created_at: ISODateTime;
}

export interface AcademicDeleteResponse {
  deletedAcademicId: UUID;
  degree: string;
  college: string;
}

const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
const urlString = z.string().regex(urlPattern, "Invalid URL format");
const linksSchema = z
  .record(z.string().min(1).max(100), urlString.max(2000))
  .nullable()
  .refine((links) => !links || Object.keys(links).length <= 10, {
    message: "Cannot exceed 10 academic links",
  });
const monthSchema = z.number().int().min(1).max(12).nullable();
const yearSchema = z.number().int().min(1900).max(2100).nullable();

export const AcademicCreateRequestSchema = z.object({
  degree_name: z
    .string()
    .min(2, "Degree name must be at least 2 characters long")
    .max(255, "Degree name must not exceed 255 characters")
    .transform((s) => s.trim()),
  college_name: z
    .string()
    .min(2, "College name must be at least 2 characters long")
    .max(255, "College name must not exceed 255 characters")
    .transform((s) => s.trim()),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .transform((s) => s?.trim() || null)
    .nullable()
    .optional(),
  links: linksSchema.optional(),
  start_month: monthSchema.optional(),
  start_year: yearSchema.optional(),
  end_month: monthSchema.optional(),
  end_year: yearSchema.optional(),
  priority: z.number().int().min(0).nullable().optional(),
});

export const AcademicUpdateRequestSchema = AcademicCreateRequestSchema.partial();
