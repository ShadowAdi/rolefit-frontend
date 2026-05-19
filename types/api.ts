import { ISODateTime, UUID } from "./common";

export type { UUID } from "./common";

export interface UserRegisterResponseData {
  id: UUID;
  email: string;
  created_at: ISODateTime;
}

export interface ValidationErrorField {
  field: string;
  code: string;
  message: string;
  constraint?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message?: string;
  data?: T;
  timestamp?: ISODateTime;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  status_code: number;
  message?: string;
  detail?: string;
  error?: string;
  error_type?: string;
  errors?: ValidationErrorField[];
  timestamp?: ISODateTime;
}

export type ApiResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string; detail?: string; errors?: ValidationErrorField[] };

export type ApiResponseResult<T> = ApiResponse<T> | ApiErrorResponse;

export const isApiError = (response: unknown): response is ApiErrorResponse => {
  if (!response || typeof response !== "object") return false;
  const r = response as ApiErrorResponse;
  return r.success === false || (typeof r.status_code === "number" && r.status_code >= 400);
};

export const unwrap = <T>(res: ApiResponseResult<T>): T => {
  if (isApiError(res) || !("data" in res) || res.data === undefined) {
    throw new Error((res as ApiErrorResponse).message || "API error");
  }
  return res.data as T;
};
