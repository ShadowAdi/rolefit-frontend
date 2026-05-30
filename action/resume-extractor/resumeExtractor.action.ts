import { ResumeExtractorRequest, ResumeExtractorResponse } from "@/types";
import { apiRequest } from "../_apiRequest";

export const ResumeExtractAction = (
  payload: ResumeExtractorRequest,
  token: string,
) =>
  apiRequest<ResumeExtractorResponse>({
    method: "post",
    url: `/resume-extractor/?resume_url=${encodeURIComponent(payload.resume_url)}`,
    token,
    errorMessage: "Resume Extraction failed",
  });