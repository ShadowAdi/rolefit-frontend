import {
  JobDescriptionCreateRequest,
  JobDescriptionResponse,
  JobDescriptionUpdateRequest,
} from "@/types";
import { apiRequest } from "../_apiRequest";

export const CreateJDAction = (
  payload: JobDescriptionCreateRequest,
  token: string,
) =>
  apiRequest<JobDescriptionResponse>({
    method: "post",
    url: "/job-descriptions/",
    token,
    body: payload,
    errorMessage: "Job Description creation failed",
  });

export const GetJDAction = (jdId: string, token: string) =>
  apiRequest<JobDescriptionResponse>({
    method: "get",
    url: "/job-descriptions/" + jdId,
    token,
    errorMessage: "Job Description fetch failed",
  });

export const GetJDsAction = (token: string) =>
  apiRequest<JobDescriptionResponse[]>({
    method: "get",
    url: "/job-descriptions/",
    token,
    errorMessage: "Job Descriptions fetch failed",
  });

export const UpdateJDAction = (
  jdId: string,
  payload: JobDescriptionUpdateRequest,
  token: string,
) =>
  apiRequest<JobDescriptionResponse>({
    method: "patch",
    body: payload,
    url: "/job-descriptions/" + jdId,
    token,
    errorMessage: "Job Descriptions patch failed",
  });


  export const GenerateJDAction = (
  jobDescription: string,
  token: string,
) =>
  apiRequest<JobDescriptionResponse>({
    method: "post",
    body: jobDescription,
    url: "/job-descriptions/generate",
    token,
    errorMessage: "Job Descriptions generation failed",
  });

export const DeleteJDsAction = (jdId: string, token: string) =>
  apiRequest<JobDescriptionResponse>({
    method: "delete",
    url: "/job-descriptions/" + jdId,
    token,
    errorMessage: "Job Descriptions delete failed",
  });
