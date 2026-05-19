export type UUID = string;

export type ISODateTime = string;

export interface IdParam {
  id: string;
}

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type SortOrder = "asc" | "desc";
