import { ISODateTime, UUID } from "./common";

export interface ToolCreateRequest {
  name: string;
}

export interface ToolUpdateRequest {
  name: string;
}

export interface AddToolToUserRequest {
  toolId?: UUID;
  toolName?: string;
}

export interface ToolCreateResponse {
  id: UUID;
  name: string;
  created_by: UUID;
  created_at: ISODateTime;
}

export interface ToolGetResponse {
  id: UUID;
  name: string;
  created_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ToolUpdateResponse {
  id: UUID;
  name: string;
  updated_at: ISODateTime;
}

export interface ToolListResponse {
  id: UUID;
  name: string;
  created_by: UUID;
  created_at: ISODateTime;
}

export interface ToolDeleteResponse {
  toolId?: UUID;
  toolName?: string;
}

export interface AddToolToUserResponse {
  toolId: UUID;
  toolName: string;
  toolCreated?: boolean;
}

export interface RemoveToolFromUserResponse {
  toolId: UUID;
}
