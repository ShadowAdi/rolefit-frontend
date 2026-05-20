import axiosInstance from "@/api/axios-instance";
import {
  AddSkillToUserRequest,
  AddSkillToUserResponse,
  AddToolToUserRequest,
  AddToolToUserResponse,
  ApiErrorResponse,
  ApiResponse,
  ExperienceCreatedData,
  SkillCreateResponse,
  SkillDeleteResponse,
  SkillGetResponse,
  SkillListResponse,
  SkillUpdateRequest,
  SkillUpdateResponse,
  ToolDeleteResponse,
  ToolGetResponse,
  ToolListResponse,
  ToolUpdateRequest,
  ToolUpdateResponse,
  ValidationErrorField,
} from "@/types";

export const CreateToolAction = async (
  payload: AddToolToUserRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: AddToolToUserResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<AddToolToUserResponse>
    >(`/tools/user/add`, payload, {
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
        errorData?.message || errorData?.detail || "Tool creation failed",
      errors: errorData?.errors,
    };
  }
};

export const GetToolsAction = async (
  token: string,
): Promise<{
  success: boolean;
  data?: ToolListResponse[];
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ToolListResponse[]>>(
      `/tools/`,
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
      message: errorData?.message || errorData?.detail || "Tools fetch failed",
      errors: errorData?.errors,
    };
  }
};

export const GetUserToolsAction = async (
  token: string,
): Promise<{
  success: boolean;
  data?: ToolListResponse[];
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ToolListResponse[]>>(
      `/tools/user/me`,
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
      message: data.message || "Failed to fetch user tools",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message ||
        errorData?.detail ||
        "Failed to fetch user tools",
      errors: errorData?.errors,
    };
  }
};

export const GetToolAction = async (
  token: string,
  toolId: string,
): Promise<{
  success: boolean;
  data?: ToolGetResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ToolGetResponse>>(
      `/tools/${toolId}`,
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
      message: errorData?.message || errorData?.detail || "Tool fetch failed",
      errors: errorData?.errors,
    };
  }
};

export const DeleteToolAction = async (
  token: string,
  toolId: string,
): Promise<{
  success: boolean;
  data?: ToolDeleteResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.delete<
      ApiResponse<ToolDeleteResponse>
    >(`/tools/user/remove/${toolId}`, {
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
      message: data.message || "Failed to delete tool",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to delete tool",
      errors: errorData?.errors,
    };
  }
};

export const UpdateToolAction = async (
  token: string,
  toolId: string,
  updatedToolName: ToolUpdateRequest,
): Promise<{
  success: boolean;
  data?: ToolUpdateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<ToolUpdateResponse>
    >(
      `/tools/${toolId}`,
      {
        name: updatedToolName.name,
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
      message: data.message || "Failed to update tool",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to update tool",
      errors: errorData?.errors,
    };
  }
};
