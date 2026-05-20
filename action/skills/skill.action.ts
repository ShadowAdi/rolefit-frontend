import axiosInstance from "@/api/axios-instance";
import {
  AddSkillToUserRequest,
  AddSkillToUserResponse,
  ApiErrorResponse,
  ApiResponse,
  ExperienceCreatedData,
  SkillCreateResponse,
  SkillListResponse,
  ValidationErrorField,
} from "@/types";

export const CreateSkillAction = async (
  payload: AddSkillToUserRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: AddSkillToUserResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<AddSkillToUserResponse>
    >(`/skills/user/add`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    if (data.success) {
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    }
    return {
      success: false,
      message: data.message || "Result creation failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Skill creation failed",
      errors: errorData?.errors,
    };
  }
};

export const GetSkillsAction = async (
  token: string,
): Promise<{
  success: boolean;
  data?: SkillListResponse[];
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<SkillListResponse[]>>(
      `/skills/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = response.data;
    if (data.success) {
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    }
    return {
      success: false,
      message: data.message || "Result fetch failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message: errorData?.message || errorData?.detail || "Skill fetch failed",
      errors: errorData?.errors,
    };
  }
};
