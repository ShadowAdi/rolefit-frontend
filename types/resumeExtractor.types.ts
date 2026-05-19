import { UUID } from "./common";

export interface ResumeExtractorRequest {
  resume_url: string;
}

export interface ResumeExtractorCounts {
  experience: number;
  academics: number;
  achievements: number;
  projects: number;
  publications: number;
  skills: number;
  tools: number;
}

export interface ResumeExtractorResponse {
  profile_id: UUID;
  counts: ResumeExtractorCounts;
}
