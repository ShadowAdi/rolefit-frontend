import {
  AddSkillToUserRequest,
  AddSkillToUserResponse,
  SkillDeleteResponse,
  SkillGetResponse,
  SkillListResponse,
  SkillUpdateRequest,
  SkillUpdateResponse,
} from "@/types";
import { apiRequest } from "../_apiRequest";

export const CreateSkillAction = (
  payload: AddSkillToUserRequest,
  token: string,
) =>
  apiRequest<AddSkillToUserResponse>({
    method: "post",
    url: "/skills/user/add",
    token,
    body: payload,
    errorMessage: "Skill creation failed",
  });

export const GetSkillsAction = (token: string) =>
  apiRequest<SkillListResponse[]>({
    method: "get",
    url: "/skills/",
    token,
    errorMessage: "Skill fetch failed",
  });

export const GetUserSkillsAction = (token: string) =>
  apiRequest<SkillListResponse[]>({
    method: "get",
    url: "/skills/user/me",
    token,
    errorMessage: "Failed to fetch user skills",
  });

export const GetSkillAction = (token: string, skillId: string) =>
  apiRequest<SkillGetResponse>({
    method: "get",
    url: `/skills/${skillId}`,
    token,
    errorMessage: "Skill fetch failed",
  });

export const DeleteSkillAction = (token: string, skillId: string) =>
  apiRequest<SkillDeleteResponse>({
    method: "delete",
    url: `/skills/user/remove/${skillId}`,
    token,
    errorMessage: "Failed to delete skill",
  });

export const UpdateSkillAction = (
  token: string,
  skillId: string,
  payload: SkillUpdateRequest,
) =>
  apiRequest<SkillUpdateResponse>({
    method: "patch",
    url: `/skills/${skillId}`,
    token,
    body: { name: payload.name },
    errorMessage: "Failed to update skill",
  });
