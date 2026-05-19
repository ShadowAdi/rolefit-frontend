import { ISODateTime, UUID } from "./common";

export interface PublicationCreateRequest {
  title: string;
  publisher: string;
  publication_date: ISODateTime;
  authors: string[];
  description?: string | null;
  url?: string | null;
  priority?: number | null;
}

export interface PublicationUpdateRequest {
  title?: string;
  publisher?: string;
  publication_date?: ISODateTime;
  authors?: string[];
  description?: string | null;
  url?: string | null;
  priority?: number | null;
}

export interface PublicationCreateResponse {
  id: UUID;
  title: string;
  publisher: string;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface PublicationGetResponse {
  id: UUID;
  title: string;
  publisher: string;
  publication_date: ISODateTime;
  authors: string[];
  description: string | null;
  url: string | null;
  priority: number | null;
  profileId: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface PublicationUpdateResponse {
  id: UUID;
  title: string;
  publisher: string;
  publication_date: ISODateTime;
  authors: string[];
  description: string | null;
  url: string | null;
  priority: number | null;
  updated_at: ISODateTime;
}

export interface PublicationListResponse {
  id: UUID;
  title: string;
  publisher: string;
  publication_date: ISODateTime;
  priority: number | null;
  profileId: UUID;
  created_at: ISODateTime;
}

export interface PublicationDeleteResponse {
  deletedPublicationId?: UUID;
  title?: string;
  publisher?: string;
}
