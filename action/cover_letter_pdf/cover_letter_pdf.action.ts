import { apiRequest } from "../_apiRequest";

export const DownloadCoverLetterPdfAction = (docId: string, token: string, cover_letter_type: string) =>
  apiRequest({
    method: "get",
    url: `/cover-router/${docId}/download?cover_letter_type=${cover_letter_type}`,
    token,
    responseType: "blob",
    errorMessage: "Download Cover Letter pdf failed",
  });

export const ListTemplates = (token: string) =>
  apiRequest({
    method: "get",
    url: "/cover-router/templates",
    token,
    errorMessage: "Templates Fetch failed",
  });