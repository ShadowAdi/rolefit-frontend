import axiosInstance from "@/api/axios-instance";
import {
  AddSkillToUserRequest,
  AddSkillToUserResponse,
  ApiErrorResponse,
  ApiResponse,
  ExperienceCreatedData,
  SkillCreateResponse,
  SkillDeleteResponse,
  SkillGetResponse,
  SkillListResponse,
  SkillUpdateRequest,
  SkillUpdateResponse,
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

export const GetSkillAction = async (
  token: string,
  skillId: string,
): Promise<{
  success: boolean;
  data?: SkillGetResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<SkillGetResponse>>(
      `/skills/${skillId}`,
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

export const DeleteSkillAction = async (
  token: string,
  skillId: string,
): Promise<{
  success: boolean;
  data?: SkillDeleteResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.delete<
      ApiResponse<SkillDeleteResponse>
    >(`/skills/user/remove/${skillId}`, {
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
      message: data.message || "Failed to delete skill",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to delete skill",
      errors: errorData?.errors,
    };
  }
};

export const UpdateSkillAction = async (
  token: string,
  skillId: string,
  updatedSkillName: SkillUpdateRequest,
): Promise<{
  success: boolean;
  data?: SkillUpdateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<SkillUpdateResponse>
    >(
      `/skills/${skillId}`,
      {
        name: updatedSkillName.name,
      },
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
      message: data.message || "Failed to update skill",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to update skill",
      errors: errorData?.errors,
    };
  }
};
