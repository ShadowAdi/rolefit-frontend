// types/verification.ts
export interface VerificationResponse {
  message: string;
  is_verified: boolean;
  verified_at?: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface VerificationStatus {
  is_verified: boolean;
  user_id: string;
  email: string;
}