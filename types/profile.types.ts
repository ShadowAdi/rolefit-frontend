import { ISODateTime, UUID } from "./common";

export type ProfileLinks = Record<string, unknown>;

export interface ProfileCreateRequest {
  full_name: string;
  headline?: string | null;
  summary?: string | null;
  resume_link?: string | null;
  cover_letter_link?: string | null;
  links?: ProfileLinks | null;
}

export type ProfilePayload = ProfileCreateRequest;

export interface ProfileUpdateRequest {
  full_name?: string;
  headline?: string | null;
  summary?: string | null;
  resume_link?: string | null;
  cover_letter_link?: string | null;
  links?: ProfileLinks | null;
}

export type ProfileUpdatePayload = ProfileUpdateRequest;

export interface ProfileCreateResponse {
  id: UUID;
  userId: UUID;
  full_name: string;
  headline: string | null;
  summary: string | null;
  resume_link: string | null;
  cover_letter_link: string | null;
  links: ProfileLinks | null;
  created_at: ISODateTime;
}

export interface ProfileGetResponse {
  id: UUID;
  userId: UUID;
  full_name: string;
  headline: string | null;
  summary: string | null;
  resume_link: string | null;
  cover_letter_link: string | null;
  links: ProfileLinks | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export type ProfileAuthenticatedResponse = ProfileGetResponse;

export interface ProfileUpdateResponse {
  id: UUID;
  userId: UUID;
  full_name: string;
  headline: string | null;
  summary: string | null;
  resume_link: string | null;
  cover_letter_link: string | null;
  links: ProfileLinks | null;
  updated_at: ISODateTime;
}

export interface ProfileDeleteResponse {
  message: string;
  id: UUID;
  full_name: string;
}

export interface ProfileSuccess {
  success: true;
  data: {
    success: boolean;
    status_code: number;
    message: string;
    data: ProfileAuthenticatedResponse;
  };
}

export interface ProfileDeleteSuccess {
  success: true;
  data: {
    success: boolean;
    status_code: number;
    message: string;
    data: ProfileDeleteResponse;
  };
}

export interface ProfileError {
  success: false;
  message: string;
  detail?: string;
}

export type ProfileResult = ProfileSuccess | ProfileError;
export type ProfileDeleteResult = ProfileDeleteSuccess | ProfileError;
