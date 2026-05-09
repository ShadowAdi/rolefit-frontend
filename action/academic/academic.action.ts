import axiosInstance from "@/api/axios-instance";
import {
  AcademicCreateRequest,
  AcademicCreateResponse,
  AcademicGetResponse,
  AcademicListResponse,
} from "@/types/academic.types";
import {
  ApiErrorResponse,
  ApiResponse,
  ValidationErrorField,
} from "@/types/api";

export const CreateAcademicAction = async (
  payload: AcademicCreateRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: AcademicCreateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<AcademicCreateResponse>
    >("/academics/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response create academics: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Academic creation failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Academic creation failed",
      errors: errorData?.errors,
    };
  }
};

export const GetAllAcademicAction = async (
  token: string,
): Promise<{
  success: boolean;
  data?: AcademicListResponse[];
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<AcademicListResponse[]>
    >("/academics/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response create academics: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Academic fetch failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Academic fetch failed",
      errors: errorData?.errors,
    };
  }
};

export const GetAcademicAction = async (
  academicId: string,
  token: string,
): Promise<{
  success: boolean;
  data?: AcademicGetResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<AcademicGetResponse>
    >(`/academics/${academicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response get academics: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Academic fetch failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Academic fetch failed",
      errors: errorData?.errors,
    };
  }
};
