export interface ProfileAuthenticatedResponse {
  id: string;
  userId: string;
  full_name: string;
  summary?: string;
  headline?: string;
  resume_link?: string;
  cover_letter_link?: string;
  links?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfilePayload {
  full_name: string;
  summary?: string;
  headline?: string;
  resume_link?: string;
  cover_letter_link?: string;
  links?: string[];
}

export interface ProfileDeleteResponse {
  message:string;
  id:string;
  full_name:string
}

export interface ProfileUpdatePayload {
  full_name?: string;
  summary?: string;
  headline?: string;
  resume_link?: string;
  cover_letter_link?: string;
  links?: string[];
}

interface ProfileSuccessData {
  data: ProfileAuthenticatedResponse;
  message: string;
  status_code: number;
}

interface ProfileSuccess {
  success: true;
  data: ProfileSuccessData;
}

interface ProfileDeleteResponseWrapper {
  data: ProfileDeleteResponse;
  message: string;
  status_code: number;
}

export interface ProfileDeleteSuccess {
  success: true;
  data: ProfileDeleteResponseWrapper;
}

export interface ProfileError {
  success: false;
  message: string;
  detail?: string;
}

export type ProfileResult = ProfileSuccess | ProfileError;
export type ProfileDeleteResult = ProfileDeleteSuccess | ProfileError;
