import { ISODateTime, UUID } from "./common";

export type { ValidationErrorField } from "./api";

export enum EmploymentType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  TEMPORARY = "Temporary",
  INTERNSHIP = "Internship",
  FREELANCE = "Freelance",
  SELF_EMPLOYED = "Self-employed",
}

export enum LocationType {
  ON_SITE = "On-site",
  REMOTE = "Remote",
  HYBRID = "Hybrid",
}

export interface ExperienceCreateRequest {
  company_name: string;
  description: string;
  role: string;
  techStack?: string[] | null;
  employment_type?: EmploymentType | string | null;
  location_type?: LocationType | string | null;
  location_details?: string | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  priority?: number | null;
}

export interface ExperienceUpdateRequest {
  company_name?: string;
  description?: string;
  role?: string;
  techStack?: string[] | null;
  employment_type?: EmploymentType | string | null;
  location_type?: LocationType | string | null;
  location_details?: string | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  priority?: number | null;
}

export interface ExperienceCreatedData {
  id: UUID;
  company_name: string;
  role: string;
  profileId: UUID;
  created_at: ISODateTime;
}

export type ExperienceCreateResponse = ExperienceCreatedData;

export interface ExperienceGetResponse {
  id: UUID;
  company_name: string;
  description: string;
  role: string;
  techStack: string[] | null;
  employment_type: EmploymentType | string | null;
  location_type: LocationType | string | null;
  location_details: string | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  priority: number | null;
  profileId: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ExperienceUpdateResponse {
  id: UUID;
  company_name: string;
  description: string;
  role: string;
  techStack: string[] | null;
  employment_type: EmploymentType | string | null;
  location_type: LocationType | string | null;
  location_details: string | null;
  start_month: number | null;
  start_year: number | null;
  end_month: number | null;
  end_year: number | null;
  priority: number | null;
  updated_at: ISODateTime;
}

export interface ExperienceListResponse {
  id: UUID;
  company_name: string;
  role: string;
  employment_type: EmploymentType | string | null;
  location_type: LocationType | string | null;
  start_year: number | null;
  end_year: number | null;
  priority: number | null;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface ExperienceDeleteResponse {
  deletedExperienceId?: UUID;
  company?: string;
  role?: string;
}

export interface ExperienceListQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "priority" | "start_year";
  sortOrder?: "asc" | "desc";
  company_name?: string;
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
}
