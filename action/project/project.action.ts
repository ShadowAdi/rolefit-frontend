import axiosInstance from "@/api/axios-instance";
import {
  ApiErrorResponse,
  ApiResponse,
  ProjectCreateRequest,
  ProjectCreateResponse,
  ProjectGetResponse,
  ProjectUpdateRequest,
  ProjectUpdateResponse,
  ValidationErrorField,
} from "@/types";

export const CreateProjectAction = async (
  payload: ProjectCreateRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: ProjectCreateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<ProjectCreateResponse>
    >("/project/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response create project: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Project creation failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Project creation failed",
      errors: errorData?.errors,
    };
  }
};

export const GetProjectAction = async (
  projectId: string,
  token: string,
): Promise<{
  success: boolean;
  data?: ProjectGetResponse;
  message?: string;
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ProjectGetResponse>>(
      `/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const apiResponse = response.data;

    console.log("api response ", apiResponse.data);
    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to fetch project",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to fetch project",
    };
  }
};

export const GetProjectsAction = async (
  token: string,
): Promise<{
  success: boolean;
  data?: ProjectGetResponse;
  message?: string;
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ProjectGetResponse>>(
      `/project`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const apiResponse = response.data;

    console.log("api response ", apiResponse.data);
    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to fetch projects",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to fetch projects",
    };
  }
};

export const UpdateProjectsAction = async (
  token: string,
  projectId: string,
  projectpayload: ProjectUpdateRequest,
): Promise<{
  success: boolean;
  data?: ProjectUpdateResponse;
  message?: string;
}> => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<ProjectUpdateResponse>
    >(`/project/${projectId}`, projectpayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;

    console.log("api response ", apiResponse.data);
    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to update project",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to update projects",
    };
  }
};

export const DeleteProjectsAction = async (
  token: string,
  projectId: string,
): Promise<{
  success: boolean;
  data?: ProjectUpdateResponse;
  message?: string;
}> => {
  try {
    const response = await axiosInstance.delete<
      ApiResponse<ProjectUpdateResponse>
    >(`/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiResponse = response.data;

    console.log("api response ", apiResponse.data);
    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Failed to delete project",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Failed to delete project",
    };
  }
};