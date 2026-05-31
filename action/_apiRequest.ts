import axiosInstance from "@/api/axios-instance";
import {
  ApiErrorResponse,
  ApiResponse,
  ValidationErrorField,
} from "@/types/api";

export type ApiResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationErrorField[];
};

type BackendErrorDetail = {
  field?: string;
  type?: string;
  code?: string;
  message?: string;
};

type BackendErrorPayload = ApiErrorResponse & {
  details?: BackendErrorDetail[];
  error_code?: string;
};

const extractErrors = (
  errorData: BackendErrorPayload | undefined,
): ValidationErrorField[] | undefined => {
  if (!errorData) return undefined;
  if (errorData.errors && errorData.errors.length > 0) return errorData.errors;
  if (errorData.details && errorData.details.length > 0) {
    return errorData.details.map((d) => ({
      field: d.field ?? "",
      code: d.code ?? d.type ?? "",
      message: d.message ?? "",
    }));
  }
  return undefined;
};

const extractMessage = (
  errorData: BackendErrorPayload | undefined,
  fallback: string,
): string =>
  errorData?.message || errorData?.detail || errorData?.error || fallback;

type Method = "get" | "post" | "patch" | "put" | "delete";

interface RequestOptions {
  method: Method;
  url: string;
  token?: string;
  body?: unknown;
  params?: Record<string, unknown>;
  errorMessage: string;
}

export const apiRequest = async <T>({
  method,
  url,
  token,
  body,
  params,
  errorMessage,
}: RequestOptions): Promise<ApiResult<T>> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const response =
      method === "get" || method === "delete"
        ? await axiosInstance.request<ApiResponse<T>>({
            method,
            url,
            params,
            headers,
          })
        : await axiosInstance.request<ApiResponse<T>>({
            method,
            url,
            data: body,
            params,
            headers,
          });

    const apiResponse = response.data;

    if (apiResponse.success) {
      return {
        success: true,
        data: apiResponse.data,
        message: apiResponse.message,
      };
    }

    return {
      success: false,
      message: apiResponse.message || errorMessage,
    };
  } catch (error: unknown) {
    const errorData = (error as { response?: { data?: BackendErrorPayload } })
      ?.response?.data;

    return {
      success: false,
      message: extractMessage(errorData, errorMessage),
      errors: extractErrors(errorData),
    };
  }
};
