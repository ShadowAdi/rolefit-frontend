import { ResumeExtractorRequest, ResumeExtractorResponse } from "@/types";
import { apiRequest } from "../_apiRequest";

export const ResumeExtractAction = (
  payload: ResumeExtractorRequest,
  token: string,
) =>
  apiRequest<ResumeExtractorResponse>({
    method: "post",
    url: "/resume-extractor",
    token,
    body: payload.resume_url,
    errorMessage: "Resume Extraction failed",
  });