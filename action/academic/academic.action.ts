import {
  AcademicCreateRequest,
  AcademicCreateResponse,
  AcademicDeleteResponse,
  AcademicGetResponse,
  AcademicListResponse,
  AcademicUpdatePayload,
  AcademicUpdateResponse,
} from "@/types/academic.types";
import { apiRequest } from "../_apiRequest";

export const CreateAcademicAction = (
  payload: AcademicCreateRequest,
  token: string,
) =>
  apiRequest<AcademicCreateResponse>({
    method: "post",
    url: "/academics/",
    token,
    body: payload,
    errorMessage: "Academic creation failed",
  });

export const GetAllAcademicAction = (token: string) =>
  apiRequest<AcademicListResponse[]>({
    method: "get",
    url: "/academics/",
    token,
    errorMessage: "Academic fetch failed",
  });

export const GetAcademicAction = (academicId: string, token: string) =>
  apiRequest<AcademicGetResponse>({
    method: "get",
    url: `/academics/${academicId}`,
    token,
    errorMessage: "Academic fetch failed",
  });

export const UpdateAcademicAction = (
  academicId: string,
  payload: AcademicUpdatePayload,
  token: string,
) =>
  apiRequest<AcademicUpdateResponse>({
    method: "patch",
    url: `/academics/${academicId}`,
    token,
    body: payload,
    errorMessage: "Academic update failed",
  });

export const DeleteAcademicAction = (academicId: string, token: string) =>
  apiRequest<AcademicDeleteResponse>({
    method: "delete",
    url: `/academics/${academicId}`,
    token,
    errorMessage: "Academic delete failed",
  });
