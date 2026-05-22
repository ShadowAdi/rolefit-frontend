import {
  AddToolToUserRequest,
  AddToolToUserResponse,
  ToolDeleteResponse,
  ToolGetResponse,
  ToolListResponse,
  ToolUpdateRequest,
  ToolUpdateResponse,
} from "@/types";
import { apiRequest } from "../_apiRequest";

export const CreateToolAction = (
  payload: AddToolToUserRequest,
  token: string,
) =>
  apiRequest<AddToolToUserResponse>({
    method: "post",
    url: "/tools/user/add",
    token,
    body: payload,
    errorMessage: "Tool creation failed",
  });

export const GetToolsAction = (token: string) =>
  apiRequest<ToolListResponse[]>({
    method: "get",
    url: "/tools/",
    token,
    errorMessage: "Tools fetch failed",
  });

export const GetUserToolsAction = (token: string) =>
  apiRequest<ToolListResponse[]>({
    method: "get",
    url: "/tools/user/me",
    token,
    errorMessage: "Failed to fetch user tools",
  });

export const GetToolAction = (token: string, toolId: string) =>
  apiRequest<ToolGetResponse>({
    method: "get",
    url: `/tools/${toolId}`,
    token,
    errorMessage: "Tool fetch failed",
  });

export const DeleteToolAction = (token: string, toolId: string) =>
  apiRequest<ToolDeleteResponse>({
    method: "delete",
    url: `/tools/user/remove/${toolId}`,
    token,
    errorMessage: "Failed to delete tool",
  });

export const UpdateToolAction = (
  token: string,
  toolId: string,
  payload: ToolUpdateRequest,
) =>
  apiRequest<ToolUpdateResponse>({
    method: "patch",
    url: `/tools/${toolId}`,
    token,
    body: { name: payload.name },
    errorMessage: "Failed to update tool",
  });
