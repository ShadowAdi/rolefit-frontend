import axiosInstance from "@/api/axios-instance";
import { ApiErrorResponse } from "@/types/api";
import { ProfileAuthenticatedResponse, ProfilePayload, ProfileResult } from "@/types/profile.types";

export const createProfile = async (payload: ProfilePayload): Promise<ProfileResult> => {
  try {
    const response = await axiosInstance.post<ProfileAuthenticatedResponse>(
      "/profile/",
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
      message: errorData?.message || errorData?.detail || "Profile Creation failed",
      detail: errorData?.detail,
    };
  }
};
