import axiosInstance from "@/api/axios-instance";
import { ApiErrorResponse } from "@/types/api";
import { UserRegisterResponseData } from "@/types/api";

interface RegisterPayload {
  email: string;
  password: string;
}

interface RegisterSuccess {
  success: true;
  data: UserRegisterResponseData;
}

interface RegisterError {
  success: false;
  message: string;
  detail?: string;
}

type RegisterResult = RegisterSuccess | RegisterError;

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResult> => {
  try {
    const response = await axiosInstance.post<UserRegisterResponseData>(
      "/user/register",
      payload
    );

    const data = response.data;

    if (response.status === 201 && data) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: "Registration failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message: errorData?.message || errorData?.detail || "Registration failed",
      detail: errorData?.detail,
    };
  }
};
