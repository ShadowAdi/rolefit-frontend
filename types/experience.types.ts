import { UUID } from './api';


export enum EmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  TEMPORARY = 'Temporary',
  INTERNSHIP = 'Internship',
  FREELANCE = 'Freelance',
  SELF_EMPLOYED = 'Self-employed',
}


export enum LocationType {
  ON_SITE = 'On-site',
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
}


export interface ExperienceCreateRequest {
  company_name: string;
  description: string;
  role: string;
  techStack?: string[];
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
  location_details?: string;
  start_month?: number;
  start_year?: number;
  end_month?: number;
  end_year?: number;
  priority?: number;
}


export interface ExperienceUpdateRequest {
  company_name?: string;
  description?: string;
  role?: string;
  techStack?: string[];
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
  location_details?: string;
  start_month?: number;
  start_year?: number;
  end_month?: number;
  end_year?: number;
  priority?: number;
}


export interface ExperienceCreateResponse {
  id: UUID;
  company_name: string;
  role: string;
  profileId: UUID;
  created_at: string;
}

export interface ExperienceGetResponse {
  id: UUID;
  company_name: string;
  description: string;
  role: string;
  techStack?: string[];
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
  location_details?: string;
  start_month?: number;
  start_year?: number;
  end_month?: number;
  end_year?: number;
  priority?: number;
  profileId: UUID;
  created_at: string;
  updated_at: string;
}


export interface ExperienceUpdateResponse {
  id: UUID;
  company_name: string;
  description: string;
  role: string;
  techStack?: string[];
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
  location_details?: string;
  start_month?: number;
  start_year?: number;
  end_month?: number;
  end_year?: number;
  priority?: number;
  updated_at: string;
}


export interface ExperienceListResponse {
  id: UUID;
  company_name: string;
  role: string;
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
  start_year?: number;
  end_year?: number;
  priority?: number;
  profileId: UUID;
  created_at: string;
}


export interface ExperienceListAllResponse {
  data: ExperienceListResponse[];
  total: number;
  page: number;
  limit: number;
}


export interface ExperienceFilterRequest {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at' | 'priority' | 'start_year';
  sortOrder?: 'asc' | 'desc';
  company_name?: string;
  employment_type?: EmploymentType | string;
  location_type?: LocationType | string;
}


export interface ExperienceDeleteResponse {
  success: boolean;
  message: string;
  id: UUID;
}

export interface ValidationErrorField {
  field: string;
  code: string;
  message: string;
  constraint?: string;
}


export interface PayloadValidationError {
  status: 'error';
  code: string;
  message: string;
  errors: ValidationErrorField[];
}


export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  status: 'success' | 'error';
  data?: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}

export interface ExperienceFormData extends ExperienceCreateRequest {
  id?: UUID;
  isEditing?: boolean;
  isSaving?: boolean;
  errors?: Partial<Record<keyof ExperienceCreateRequest, string>>;
}

export interface ExperienceState {
  experiences: ExperienceListResponse[];
  currentExperience: ExperienceGetResponse | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  validationErrors: ValidationErrorField[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ExperienceQueryParams {
  profileId?: UUID;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at' | 'priority' | 'start_year';
  sortOrder?: 'asc' | 'desc';
  company_name?: string;
  employment_type?: string;
  location_type?: string;
}
