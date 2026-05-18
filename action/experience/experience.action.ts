import axiosInstance from "@/api/axios-instance";
import { ApiErrorResponse, ApiResponse } from "@/types/api";
import {
  ExperienceCreatedData,
  ExperienceCreateRequest,
  ExperienceGetResponse,
  ExperienceUpdateResponse,
  ExperienceDeleteResponse,
  ValidationErrorField,
} from "@/types/experience.types";

export const CreateExperienceAction = async (
  payload: ExperienceCreateRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: ExperienceCreatedData;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<ExperienceCreatedData>
    >("/experience/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response create experience: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Experience creation failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Experience creation failed",
      errors: errorData?.errors,
    };
  }
};

export const GetExperienceAction = async (
  experienceId: string,
  token: string,
): Promise<{
  success: boolean;
  data?: ExperienceGetResponse;
  message?: string;
}> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ExperienceGetResponse>
    >(`/experience/${experienceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;

    console.log("api response ",apiResponse.data)
    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to fetch experience",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to fetch experience",
    };
  }
};

export const GetAllExperiencesAction = async (
  token: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    company_name?: string;
    employment_type?: string;
    location_type?: string;
  },
): Promise<{
  success: boolean;
  data?: ExperienceGetResponse[];
  message?: string;
}> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ExperienceGetResponse[]>
    >(`/experience/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to fetch experiences",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message ||
        errorData?.detail ||
        "Failed to fetch experiences",
    };
  }
};

export const UpdateExperienceAction = async (
  experienceId: string,
  payload: Partial<ExperienceCreateRequest>,
  token: string,
): Promise<{
  success: boolean;
  data?: ExperienceUpdateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<ExperienceUpdateResponse>
    >(`/experience/${experienceId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to update experience",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message ||
        errorData?.detail ||
        "Failed to update experience",
      errors: errorData?.errors,
    };
  }
};

export const DeleteExperienceAction = async (
  experienceId: string,
  token: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.delete<
      ApiResponse<ExperienceDeleteResponse>
    >(`/experience/${experienceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;

    if (apiResponse.success) {
      return {
        success: true,
        message: apiResponse.message || "Experience deleted successfully",
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to delete experience",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message ||
        errorData?.detail ||
        "Failed to delete experience",
    };
  }
};
