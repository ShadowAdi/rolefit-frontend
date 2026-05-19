import { ISODateTime, UUID } from "./common";

export interface UserCreateRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  email?: string;
  password?: string;
}

export interface UserRegisterResponse {
  id: UUID;
  email: string;
  created_at: ISODateTime;
}

export interface UserGetResponse {
  id: UUID;
  email: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface UserUpdateResponse {
  id: UUID;
  email: string;
  updated_at: ISODateTime;
}

export interface UserDeleteResponse {
  success: boolean;
  message: string;
  deleted_user_id: UUID;
  deleted_at: ISODateTime;
}
