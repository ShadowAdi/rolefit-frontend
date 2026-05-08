import { UserAuthenticatedResponse } from './auth';

export type UUID = string;

export interface ValidationErrorField {
  field: string;
  code: string;
  message: string;
  constraint?: string;
}
// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message?: string;
  data?: T;
  timestamp: string;
}

// Login/Auth specific responses
export interface LoginResponse extends ApiResponse<UserAuthenticatedResponse> {}

// Register response
export interface UserRegisterResponseData {
  id: string;
  email: string;
  created_at: string;
}

export interface RegisterResponse extends ApiResponse<UserRegisterResponseData> {}

// Error response
export interface ApiErrorResponse {
  success: false;
  status_code: number;
  message?: string;
  detail?: string;
  error?: string;
  errors?: ValidationErrorField[];
  timestamp?: string;
}

// Union type for success or error
export type ApiResponseResult<T> = ApiResponse<T> | ApiErrorResponse;

// Helper to check if response is error
export const isApiError = (response: any): response is ApiErrorResponse => {
  return response.success === false || !response.status_code || response.status_code >= 400;
};
