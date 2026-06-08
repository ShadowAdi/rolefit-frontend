import axiosInstance from "@/api/axios-instance";
import { ApiErrorResponse } from "@/types/api";
import { ResendVerificationResponse, VerificationResponse, VerificationStatus } from "@/types/verification.types";

interface VerifyEmailSuccess {
  success: true;
  data: VerificationResponse;
}

interface VerifyEmailError {
  success: false;
  message: string;
}

type VerifyEmailResult = VerifyEmailSuccess | VerifyEmailError;

export const verifyEmail = async (token: string): Promise<VerifyEmailResult> => {
  try {
    const response = await axiosInstance.get<VerificationResponse>(
      `/verification/email`,
      {
        params: { token }
      }
    );

    if (response.status === 200 && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Verification failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    
    return {
      success: false,
      message: errorData?.message || errorData?.detail || "Invalid or expired verification link",
    };
  }
};

interface ResendVerificationSuccess {
  success: true;
  message: string;
}

interface ResendVerificationError {
  success: false;
  message: string;
}

type ResendVerificationResult = ResendVerificationSuccess | ResendVerificationError;

export const resendVerificationEmail = async (
  email: string
): Promise<ResendVerificationResult> => {
  try {
    const response = await axiosInstance.post<ResendVerificationResponse>(
      "/verification/resend",
      { email }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message || "Verification email sent successfully",
      };
    }

    return {
      success: false,
      message: "Failed to resend verification email",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    
    return {
      success: false,
      message: errorData?.message || errorData?.detail || "Failed to resend verification email",
    };
  }
};

export const checkVerificationStatus = async (
  email: string
): Promise<VerificationStatus | null> => {
  try {
    const response = await axiosInstance.get<VerificationStatus>(
      `/verification/status`,
      {
        params: { email }
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};