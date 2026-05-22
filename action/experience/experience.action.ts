import {
  ExperienceCreatedData,
  ExperienceCreateRequest,
  ExperienceDeleteResponse,
  ExperienceGetResponse,
  ExperienceUpdateResponse,
} from "@/types/experience.types";
import { apiRequest } from "../_apiRequest";

export const CreateExperienceAction = (
  payload: ExperienceCreateRequest,
  token: string,
) =>
  apiRequest<ExperienceCreatedData>({
    method: "post",
    url: "/experience/",
    token,
    body: payload,
    errorMessage: "Experience creation failed",
  });

export const GetExperienceAction = (experienceId: string, token: string) =>
  apiRequest<ExperienceGetResponse>({
    method: "get",
    url: `/experience/${experienceId}`,
    token,
    errorMessage: "Failed to fetch experience",
  });

export const GetAllExperiencesAction = (
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
) =>
  apiRequest<ExperienceGetResponse[]>({
    method: "get",
    url: "/experience/",
    token,
    params,
    errorMessage: "Failed to fetch experiences",
  });

export const UpdateExperienceAction = (
  experienceId: string,
  payload: Partial<ExperienceCreateRequest>,
  token: string,
) =>
  apiRequest<ExperienceUpdateResponse>({
    method: "patch",
    url: `/experience/${experienceId}`,
    token,
    body: payload,
    errorMessage: "Failed to update experience",
  });

export const DeleteExperienceAction = (experienceId: string, token: string) =>
  apiRequest<ExperienceDeleteResponse>({
    method: "delete",
    url: `/experience/${experienceId}`,
    token,
    errorMessage: "Failed to delete experience",
  });
