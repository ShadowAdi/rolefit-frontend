import { ISODateTime, UUID } from "./common";

export enum JDRoleType {
  FULL_TIME = "Full-time",
  INTERNSHIP = "Internship",
  CONTRACT = "Contract",
}

export enum JDLocationType {
  REMOTE = "Remote",
  HYBRID = "Hybrid",
  ON_SITE = "On-site",
}

export interface JobDescriptionCreateRequest {
  user_id?: string;
  role_name?: string | null;
  company?: string | null;
  role_type?: JDRoleType | null;
  location?: JDLocationType | null;
  location_city?: string | null;
  salary_min?: string | null;
  salary_max?: string | null;
  salary_currency?: string | null;
  duration?: string | null;
  tech_stack?: string[];
  required_skills?: string[];
  experience_required?: string | null;
  summary?: string | null;
  raw_jd: string;
  company_name?: string | null;
  company_information?: string | null;
  company_website_url?: string | null;
}

export interface JobDescriptionUpdateRequest {
  role_name?: string | null;
  company?: string | null;
  role_type?: JDRoleType | null;
  location?: JDLocationType | null;
  location_city?: string | null;
  salary_min?: string | null;
  salary_max?: string | null;
  salary_currency?: string | null;
  duration?: string | null;
  tech_stack?: string[];
  required_skills?: string[];
  experience_required?: string | null;
  summary?: string | null;
  raw_jd?: string;
  company_name?: string | null;
  company_information?: string | null;
  company_website_url?: string | null;
}

export interface JDInput {
  payload: string;
}

export interface JobDescriptionResponse {
  id: UUID;
  user_id: UUID;
  role_name: string | null;
  company: string | null;
  role_type: string | null;
  location: string | null;
  location_city: string | null;
  salary_min: string | null;
  salary_max: string | null;
  salary_currency: string | null;
  duration: string | null;
  tech_stack: string[];
  required_skills: string[];
  experience_required: string | null;
  summary: string | null;
  raw_jd: string;
  company_name: string | null;
  company_information: string | null;
  company_website_url: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}
