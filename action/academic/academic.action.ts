import axiosInstance from "@/api/axios-instance";
import {
  AcademicCreateRequest,
  AcademicCreateResponse,
  AcademicDeleteResponse,
  AcademicGetResponse,
  AcademicListResponse,
  AcademicUpdatePayload,
  AcademicUpdateResponse,
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
    const response = await axiosInstance.get<ApiResponse<AcademicGetResponse>>(
      `/academics/${academicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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

export const UpdateAcademicAction = async (
  academicId: string,
  payload: AcademicUpdatePayload,
  token: string,
): Promise<{
  success: boolean;
  data?: AcademicUpdateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<AcademicUpdateResponse>
    >(`/academics/${academicId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response update academics: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Academic update failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Academic update failed",
      errors: errorData?.errors,
    };
  }
};


export const DeleteAcademicAction = async (
  academicId: string,
  token: string,
): Promise<{
  success: boolean;
  data?: AcademicDeleteResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.delete<
      ApiResponse<AcademicDeleteResponse>
    >(`/academics/${academicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw response delete academics: ", response.data);

    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Academic delete failed",
    };
  } catch (error: any) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    return {
      success: false,
      message:
        errorData?.message || errorData?.detail || "Academic delete failed",
      errors: errorData?.errors,
    };
  }
};
