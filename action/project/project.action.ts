import {
  ProjectCreateRequest,
  ProjectCreateResponse,
  ProjectDeleteResponse,
  ProjectGetResponse,
  ProjectListResponse,
  ProjectUpdateRequest,
  ProjectUpdateResponse,
} from "@/types";
import { apiRequest } from "../_apiRequest";

export const CreateProjectAction = (
  payload: ProjectCreateRequest,
  token: string,
) =>
  apiRequest<ProjectCreateResponse>({
    method: "post",
    url: "/project/",
    token,
    body: payload,
    errorMessage: "Project creation failed",
  });

export const GetProjectAction = (projectId: string, token: string) =>
  apiRequest<ProjectGetResponse>({
    method: "get",
    url: `/project/${projectId}`,
    token,
    errorMessage: "Failed to fetch project",
  });

export const GetAllProjectsAction = (token: string) =>
  apiRequest<ProjectListResponse[]>({
    method: "get",
    url: "/project",
    token,
    errorMessage: "Failed to fetch projects",
  });

export const UpdateProjectsAction = (
  token: string,
  projectId: string,
  payload: ProjectUpdateRequest,
) =>
  apiRequest<ProjectUpdateResponse>({
    method: "patch",
    url: `/project/${projectId}`,
    token,
    body: payload,
    errorMessage: "Failed to update project",
  });

export const DeleteProjectsAction = (token: string, projectId: string) =>
  apiRequest<ProjectDeleteResponse>({
    method: "delete",
    url: `/project/${projectId}`,
    token,
    errorMessage: "Failed to delete project",
  });
