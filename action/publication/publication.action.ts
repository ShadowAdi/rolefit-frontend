import axiosInstance from "@/api/axios-instance";
import {
  ApiErrorResponse,
  ApiResponse,
  PublicationCreateRequest,
  PublicationCreateResponse,
  PublicationDeleteResponse,
  PublicationGetResponse,
  PublicationListResponse,
  PublicationUpdateRequest,
  PublicationUpdateResponse,
  ValidationErrorField,
} from "@/types";

type BackendErrorDetail = {
  field?: string;
  type?: string;
  code?: string;
  message?: string;
};

type BackendErrorPayload = ApiErrorResponse & {
  details?: BackendErrorDetail[];
  error_code?: string;
};

const extractErrors = (
  errorData: BackendErrorPayload | undefined,
): ValidationErrorField[] | undefined => {
  if (!errorData) return undefined;
  if (errorData.errors && errorData.errors.length > 0) return errorData.errors;
  if (errorData.details && errorData.details.length > 0) {
    return errorData.details.map((d) => ({
      field: d.field ?? "",
      code: d.code ?? d.type ?? "",
      message: d.message ?? "",
    }));
  }
  return undefined;
};

const extractMessage = (
  errorData: BackendErrorPayload | undefined,
  fallback: string,
): string => {
  return (
    errorData?.message || errorData?.detail || errorData?.error || fallback
  );
};

export const CreatePublication = async (
  payload: PublicationCreateRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: PublicationCreateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<PublicationCreateResponse>
    >("/publications/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
        message: apiResponse.message || "Publication created successfully",
        errors: [],
      };
    }

    return {
      success: false,
      data: {} as PublicationCreateResponse,
      message: apiResponse.message || "Publication creation failed",
      errors: [],
    };
  } catch (error) {
    const errorData = (error as any)?.response?.data as
      | BackendErrorPayload
      | undefined;
    return {
      success: false,
      data: {} as PublicationCreateResponse,
      message: extractMessage(
        errorData,
        "An error occurred while creating the publication",
      ),
      errors: extractErrors(errorData) || [],
    };
  }
};

export const GetAllPublications = async (
  token: string,
): Promise<{
  success: boolean;
  data?: PublicationListResponse[];
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<PublicationListResponse[]>
    >("/publications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
        message: apiResponse.message || "Publication fetched successfully",
        errors: [],
      };
    }

    return {
      success: false,
      data: {} as PublicationListResponse[],
      message: apiResponse.message || "Publication fetched failed",
      errors: [],
    };
  } catch (error) {
    const errorData = (error as any)?.response?.data as
      | BackendErrorPayload
      | undefined;
    return {
      success: false,
      data: {} as PublicationListResponse[],
      message: extractMessage(
        errorData,
        "An error occurred while fetching the publication",
      ),
      errors: extractErrors(errorData) || [],
    };
  }
};

export const GetPublication = async (
  pubId: string,
  token: string,
): Promise<{
  success: boolean;
  data?: PublicationGetResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<PublicationGetResponse>
    >("/publications/" + pubId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
        message: apiResponse.message || "Publication fetched successfully",
        errors: [],
      };
    }

    return {
      success: false,
      data: {} as PublicationGetResponse,
      message: apiResponse.message || "Publication fetched failed",
      errors: [],
    };
  } catch (error) {
    const errorData = (error as any)?.response?.data as
      | BackendErrorPayload
      | undefined;
    return {
      success: false,
      data: {} as PublicationGetResponse,
      message: extractMessage(
        errorData,
        "An error occurred while fetching the publication",
      ),
      errors: extractErrors(errorData) || [],
    };
  }
};

export const UpdatePublication = async (
  pubId: string,
  pubPayload: PublicationUpdateRequest,
  token: string,
): Promise<{
  success: boolean;
  data?: PublicationUpdateResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<PublicationUpdateResponse>
    >("/publications/" + pubId, pubPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
        message: apiResponse.message || "Publication updated successfully",
        errors: [],
      };
    }

    return {
      success: false,
      data: {} as PublicationGetResponse,
      message: apiResponse.message || "Publication updated failed",
      errors: [],
    };
  } catch (error) {
    const errorData = (error as any)?.response?.data as
      | BackendErrorPayload
      | undefined;
    return {
      success: false,
      data: {} as PublicationGetResponse,
      message: extractMessage(
        errorData,
        "An error occurred while updating the publication",
      ),
      errors: extractErrors(errorData) || [],
    };
  }
};

export const DeletePublication = async (
  pubId: string,
  token: string,
): Promise<{
  success: boolean;
  data?: PublicationDeleteResponse;
  message?: string;
  errors?: ValidationErrorField[];
}> => {
  try {
    const response = await axiosInstance.delete<
      ApiResponse<PublicationDeleteResponse>
    >("/publications/" + pubId,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiResponse = response.data;

    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        data: apiResponse.data,
        message: apiResponse.message || "Publication deleted successfully",
        errors: [],
      };
    }

    return {
      success: false,
      data: {} as PublicationGetResponse,
      message: apiResponse.message || "Publication deleted failed",
      errors: [],
    };
  } catch (error) {
    const errorData = (error as any)?.response?.data as
      | BackendErrorPayload
      | undefined;
    return {
      success: false,
      data: {} as PublicationGetResponse,
      message: extractMessage(
        errorData,
        "An error occurred while deleting the publication",
      ),
      errors: extractErrors(errorData) || [],
    };
  }
};
