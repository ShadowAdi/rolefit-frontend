import { ISODateTime, UUID } from "./common";

export interface SkillCreateRequest {
  name: string;
}

export interface SkillUpdateRequest {
  name: string;
}

export interface AddSkillToUserRequest {
  skillId?: UUID;
  skillName?: string;
}

export interface SkillCreateResponse {
  id: UUID;
  name: string;
  created_by: UUID;
  created_at: ISODateTime;
}

export interface SkillGetResponse {
  id: UUID;
  name: string;
  created_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface SkillUpdateResponse {
  id: UUID;
  name: string;
  updated_at: ISODateTime;
}

export interface SkillListResponse {
  id: UUID;
  name: string;
  created_by: UUID;
  created_at: ISODateTime;
}

export interface SkillDeleteResponse {
  skillId?: UUID;
  skillName?: string;
}

export interface AddSkillToUserResponse {
  skillId: UUID;
  skillName: string;
  skillCreated?: boolean;
}

export interface RemoveSkillFromUserResponse {
  skillId: UUID;
}
