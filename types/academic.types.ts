// academic.types.ts
import { z } from 'zod';


const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

export type MonthRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type YearRange = 1900 | 1901 | 1902 | /* ... up to */ 2100;

const urlString = z.string().regex(urlPattern, 'Invalid URL format');

const linksSchema = z.record(z.string().min(1).max(100), urlString.max(2000))
  .nullable()
  .refine(
    (links) => !links || Object.keys(links).length <= 10,
    { message: 'Cannot exceed 10 academic links' }
  );

const monthSchema = z.number().int().min(1).max(12).nullable();

const yearSchema = z.number().int().min(1900).max(2100).nullable();

const validateDateRange = (
  startMonth: number | null | undefined,
  startYear: number | null | undefined,
  endMonth: number | null | undefined,
  endYear: number | null | undefined
) => {
  if (startYear && endYear) {
    if (endYear < startYear) {
      throw new Error('End year cannot be before start year');
    }
    if (endYear === startYear && startMonth && endMonth && endMonth < startMonth) {
      throw new Error('End month cannot be before start month for the same year');
    }
  }
  return true;
};


export const AcademicCreateRequestSchema = z.object({
  degree_name: z.string()
    .min(1, 'Degree name cannot be empty')
    .min(2, 'Degree name must be at least 2 characters long')
    .max(255, 'Degree name must not exceed 255 characters')
    .transform(s => s.trim()),
  college_name: z.string()
    .min(1, 'College name cannot be empty')
    .min(2, 'College name must be at least 2 characters long')
    .max(255, 'College name must not exceed 255 characters')
    .transform(s => s.trim()),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .transform(s => s?.trim() || null)
    .nullable()
    .optional(),
  links: linksSchema.optional(),
  start_month: monthSchema.optional(),
  start_year: yearSchema.optional(),
  end_month: monthSchema.optional(),
  end_year: yearSchema.optional(),
  priority: z.number().int().min(0, 'Priority must be at least 0').nullable().optional(),
}).refine(
  (data) => validateDateRange(
    data.start_month,
    data.start_year,
    data.end_month,
    data.end_year
  ),
  { message: 'Invalid date range' }
);

export const AcademicUpdateRequestSchema = z.object({
  degree_name: z.string()
    .min(1, 'Degree name cannot be empty')
    .min(2, 'Degree name must be at least 2 characters long')
    .max(255, 'Degree name must not exceed 255 characters')
    .transform(s => s.trim())
    .optional(),
  college_name: z.string()
    .min(1, 'College name cannot be empty')
    .min(2, 'College name must be at least 2 characters long')
    .max(255, 'College name must not exceed 255 characters')
    .transform(s => s.trim())
    .optional(),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .transform(s => s?.trim() || null)
    .nullable()
    .optional(),
  links: linksSchema.optional(),
  start_month: monthSchema.optional(),
  start_year: yearSchema.optional(),
  end_month: monthSchema.optional(),
  end_year: yearSchema.optional(),
  priority: z.number().int().min(0, 'Priority must be at least 0').nullable().optional(),
}).refine(
  (data) => {
    const hasDateFields = data.start_month !== undefined || data.start_year !== undefined ||
                          data.end_month !== undefined || data.end_year !== undefined;
    if (hasDateFields) {
      return validateDateRange(
        data.start_month ?? null,
        data.start_year ?? null,
        data.end_month ?? null,
        data.end_year ?? null
      );
    }
    return true;
  },
  { message: 'Invalid date range' }
);


export const AcademicCreateResponseSchema = z.object({
  degree_name: z.string(),
  college_name: z.string(),
  profileId: z.string(),
  description: z.string().nullable(),
  links: z.record(z.string(), z.string()).nullable(),
  start_month: z.number().nullable(),
  start_year: z.number().nullable(),
  end_month: z.number().nullable(),
  end_year: z.number().nullable(),
  priority: z.number().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const AcademicGetResponseSchema = z.object({
  id: z.string(),
  degree_name: z.string(),
  college_name: z.string(),
  profileId: z.string(),
  description: z.string().nullable(),
  links: z.record(z.string(), z.string()).nullable(),
  start_month: z.number().nullable(),
  start_year: z.number().nullable(),
  end_month: z.number().nullable(),
  end_year: z.number().nullable(),
  priority: z.number().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const AcademicUpdateResponseSchema = z.object({
  degree_name: z.string(),
  college_name: z.string(),
  profileId: z.string(),
  description: z.string().nullable(),
  links: z.record(z.string(), z.string()).nullable(),
  start_month: z.number().nullable(),
  start_year: z.number().nullable(),
  end_month: z.number().nullable(),
  end_year: z.number().nullable(),
  priority: z.number().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const AcademicDeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  deletedAcademicId: z.string(),
  degree: z.string(),
  college: z.string(),
});

export const AcademicListResponseSchema = z.array(AcademicGetResponseSchema);


export type AcademicCreateRequest = z.infer<typeof AcademicCreateRequestSchema>;
export type AcademicUpdateRequest = z.infer<typeof AcademicUpdateRequestSchema>;
export type AcademicCreateResponse = z.infer<typeof AcademicCreateResponseSchema>;
export type AcademicGetResponse = z.infer<typeof AcademicGetResponseSchema>;
export type AcademicUpdateResponse = z.infer<typeof AcademicUpdateResponseSchema>;
export type AcademicDeleteResponse = z.infer<typeof AcademicDeleteResponseSchema>;
export type AcademicListResponse = z.infer<typeof AcademicListResponseSchema>;


export function validateAcademicCreate(data: unknown): AcademicCreateRequest {
  return AcademicCreateRequestSchema.parse(data);
}

export function validateAcademicUpdate(data: unknown): AcademicUpdateRequest {
  return AcademicUpdateRequestSchema.parse(data);
}

export function validateAcademicResponse(data: unknown): AcademicGetResponse {
  return AcademicGetResponseSchema.parse(data);
}

export function validateAcademicListResponse(data: unknown): AcademicListResponse {
  return AcademicListResponseSchema.parse(data);
}

export function validateAcademicDeleteResponse(data: unknown): AcademicDeleteResponse {
  return AcademicDeleteResponseSchema.parse(data);
}

export function safeValidateAcademicCreate(data: unknown): {
  success: boolean;
  data?: AcademicCreateRequest;
  error?: z.ZodError;
} {
  const result = AcademicCreateRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function safeValidateAcademicUpdate(data: unknown): {
  success: boolean;
  data?: AcademicUpdateRequest;
  error?: z.ZodError;
} {
  const result = AcademicUpdateRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export interface AcademicLinks {
  [key: string]: string;
}

export interface AcademicBase {
  degree_name: string;
  college_name: string;
  description: string | null;
  links: AcademicLinks | null;
  start_month: MonthRange | null;
  start_year: number | null;
  end_month: MonthRange | null;
  end_year: number | null;
  priority: number | null;
}

export interface AcademicCreatePayload {
  degree_name: string;
  college_name: string;
  description?: string | null;
  links?: AcademicLinks | null;
  start_month?: MonthRange | null;
  start_year?: number | null;
  end_month?: MonthRange | null;
  end_year?: number | null;
  priority?: number | null;
}

export interface AcademicUpdatePayload {
  degree_name?: string;
  college_name?: string;
  description?: string | null;
  links?: AcademicLinks | null;
  start_month?: MonthRange | null;
  start_year?: number | null;
  end_month?: MonthRange | null;
  end_year?: number | null;
  priority?: number | null;
}

export interface AcademicListQueryParams {
  degree_name?: string;
  college_name?: string;
  start_year?: number;
  end_year?: number;
  sort_by?: 'start_year' | 'start_month' | 'priority' | 'created_at' | 'degree_name';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AcademicDeleteParams {
  academicId: string;
}

export interface AcademicGetParams {
  academicId: string;
}

export interface AcademicBaseResponse {
  id: string;
  degree_name: string;
  college_name: string;
  profileId: string;
  description: string | null;
  links: Record<string, string> | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  priority: number | null;
  created_at: string;
  updated_at: string;
}

export interface ValidationErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}

export interface AcademicValidationErrorResponse {
  detail: ValidationErrorDetail[];
}

export interface AcademicHTTPErrorResponse {
  detail: string;
  status_code: number;
}

export interface AcademicState {
  academics: AcademicBaseResponse[];
  currentAcademic: AcademicBaseResponse | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
