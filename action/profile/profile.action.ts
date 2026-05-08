import axiosInstance from "@/api/axios-instance";
import { ApiErrorResponse } from "@/types/api";
import {
  ProfileAuthenticatedResponse,
  ProfileDeleteResult,
  ProfileDeleteResponse,
  ProfileDeleteSuccess,
  ProfilePayload,
  ProfileResult,
  ProfileUpdatePayload,
} from "@/types/profile.types";

export const createProfile = async (
  payload: ProfilePayload,
  token: string,
): Promise<ProfileResult> => {
  try {
    const response = await axiosInstance.post<ProfileAuthenticatedResponse>(
      "/profile/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Raw response create profile ", response.data);

    const data = response.data;

    if (response.status === 200 && data) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: "Profile Creation failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Profile Creation failed",
      detail: errorData?.detail,
    };
  }
};

export const getProfile = async (token: string): Promise<ProfileResult> => {
  try {
    const response = await axiosInstance.get<ProfileAuthenticatedResponse>(
      "/profile/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Raw response fetch profile ", response.data);

    const data = response.data;

    if (response.status === 200 && data) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: "Profile Fetch failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Profile fetch failed",
      detail: errorData?.detail,
    };
  }
};

export const updateProfile = async (
  token: string,
  payload: ProfileUpdatePayload,
): Promise<ProfileResult> => {
  try {
    const response = await axiosInstance.patch<ProfileAuthenticatedResponse>(
      "/profile/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
      message: "Profile Update failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Profile Update failed",
      detail: errorData?.detail,
    };
  }
};

export const deleteProfile = async (
  token: string,
): Promise<ProfileDeleteResult> => {
  try {
    const response = await axiosInstance.delete<ProfileDeleteResponse>(
      "/profile/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
      message: "Profile Deletion failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Profile Deletion failed",
      detail: errorData?.detail,
    };
  }
};
