import { ISODateTime, UUID } from "./common";

export type ProjectLinks = Record<string, string>;

export interface ProjectCreateRequest {
  title: string;
  description: string;
  techStack?: string[] | null;
  links?: ProjectLinks | null;
  startDate?: ISODateTime | null;
  endDate?: ISODateTime | null;
  priority?: number | null;
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  techStack?: string[] | null;
  links?: ProjectLinks | null;
  startDate?: ISODateTime | null;
  endDate?: ISODateTime | null;
  priority?: number | null;
}

export interface ProjectCreateResponse {
  id: UUID;
  title: string;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface ProjectGetResponse {
  id: UUID;
  title: string;
  description: string;
  profileId: UUID;
  techStack: string[] | null;
  links: ProjectLinks | null;
  startDate: ISODateTime | null;
  endDate: ISODateTime | null;
  priority: number | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ProjectUpdateResponse {
  id: UUID;
  title: string;
  description: string;
  techStack: string[] | null;
  links: ProjectLinks | null;
  startDate: ISODateTime | null;
  endDate: ISODateTime | null;
  priority: number | null;
  updated_at: ISODateTime;
}

export interface ProjectListResponse {
  id: UUID;
  title: string;
  description: string;
  profileId: UUID;
  techStack: string[] | null;
  startDate: ISODateTime | null;
  endDate: ISODateTime | null;
  priority: number | null;
  created_at: ISODateTime;
}

export interface ProjectDeleteResponse {
  deletedProjectId?: UUID;
  title?: string;
}
