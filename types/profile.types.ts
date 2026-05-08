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

interface ProfileSuccess {
  success: true;
  data: ProfileAuthenticatedResponse;
}

export interface ProfileError {
  success: false;
  message: string;
  detail?: string;
}

export type ProfileResult = ProfileSuccess | ProfileError;
