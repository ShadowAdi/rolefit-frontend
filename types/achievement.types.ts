import { ISODateTime, UUID } from "./common";

export type AchievementLinks = Record<string, string>;

export interface AchievementCreateRequest {
  title: string;
  achievement_type: string;
  description: string;
  location?: string | null;
  start_month?: string | null;
  start_year?: number | null;
  end_month?: string | null;
  end_year?: number | null;
  links?: AchievementLinks | null;
  priority?: number | null;
}

export interface AchievementUpdateRequest {
  title?: string;
  achievement_type?: string;
  description?: string;
  location?: string | null;
  start_month?: string | null;
  start_year?: number | null;
  end_month?: string | null;
  end_year?: number | null;
  links?: AchievementLinks | null;
  priority?: number | null;
}

export interface AchievementCreateResponse {
  id: UUID;
  title: string;
  achievement_type: string;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface AchievementGetResponse {
  id: UUID;
  title: string;
  achievement_type: string;
  description: string;
  location: string | null;
  start_month: string | null;
  start_year: number | null;
  end_month: string | null;
  end_year: number | null;
  links: AchievementLinks | null;
  priority: number | null;
  profileId: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface AchievementUpdateResponse {
  id: UUID;
  title: string;
  achievement_type: string;
  description: string;
  location: string | null;
  start_month: string | null;
  start_year: number | null;
  end_month: string | null;
  end_year: number | null;
  links: AchievementLinks | null;
  priority: number | null;
  updated_at: ISODateTime;
}

export interface AchievementListResponse {
  id: UUID;
  title: string;
  achievement_type: string;
  location: string | null;
  start_year: number | null;
  end_year: number | null;
  priority: number | null;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface AchievementDeleteResponse {
  deletedAchievementId?: UUID;
  title?: string;
  achievement_type?: string;
}
