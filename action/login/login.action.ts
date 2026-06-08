import axiosInstance from "@/api/axios-instance";
import { ApiErrorResponse } from "@/types/api";
import { UserAuthenticatedResponse } from "@/types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginSuccess {
  success: true;
  data: UserAuthenticatedResponse;
}

interface LoginError {
  success: false;
  message: string;
  detail?: string;
  needsVerification?: boolean;
}

type LoginResult = LoginSuccess | LoginError;

export const loginUser = async (payload: LoginPayload): Promise<LoginResult> => {
  try {
    const response = await axiosInstance.post<UserAuthenticatedResponse>(
      "/auth/login",
      payload
    );

    const data = response.data;

    if (response.status === 200 && data) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: "Login failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message: errorData?.message || errorData?.detail || "Login failed",
      detail: errorData?.detail,
      needsVerification: error.response?.status === 403,
    };
  }
};
