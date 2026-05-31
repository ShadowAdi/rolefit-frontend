import {
  GenerateContentQuery,
  GeneratedDocumentCreateResponse,
  GeneratedDocumentDeleteResponse,
  GeneratedDocumentResponse,
  GeneratedDocumentStatusResponse,
} from "@/types";
import { apiRequest } from "../_apiRequest";

export const CreateResumeContentAction = (
  payload: GenerateContentQuery,
  jobId: string,
  token: string,
) =>
  apiRequest<GeneratedDocumentCreateResponse>({
    method: "post",
    url: "/content/" + jobId,
    token,
    body: payload,
    errorMessage: "Generate Documnet creation failed",
  });

export const CreateCoverLetterContentAction = (
  payload: GenerateContentQuery,
  jobId: string,
  token: string,
) =>
  apiRequest<GeneratedDocumentCreateResponse>({
    method: "post",
    url: "/cover-letter/" + jobId,
    token,
    body: payload,
    errorMessage: "Generate Cover letter Documnet creation failed",
  });

export const GetContentResumeAction = (contentId: string, token: string) =>
  apiRequest<GeneratedDocumentResponse>({
    method: "get",
    url: `/content/${contentId}`,
    token,
    errorMessage: "Failed to fetch content",
  });

export const GetAllContentsAction = (jobId: string, token: string) =>
  apiRequest<GeneratedDocumentResponse[]>({
    method: "get",
    url: "/content/" + jobId,
    token,
    errorMessage: "Failed to fetch contents",
  });

export const DeleteContentAction = (token: string, contentId: string) =>
  apiRequest<GeneratedDocumentDeleteResponse>({
    method: "delete",
    url: `/content/${contentId}`,
    token,
    errorMessage: "Failed to delete content",
  });


export const ContentStatussAction = (token: string, docId: string) =>
  apiRequest<GeneratedDocumentStatusResponse>({
    method: "get",
    url: `/content/${docId}/status`,
    token,
    errorMessage: "Failed to get content content",
  });
