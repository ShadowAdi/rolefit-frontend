import { apiRequest } from "../_apiRequest";

export const DownloadResumePdfAction = (docId: string, token: string, resume_type: string) =>
  apiRequest({
    method: "get",
    url: `/resume/${docId}/download?resume_type=${resume_type}`,
    token,
    responseType: "blob",
    errorMessage: "Download Resume pdf failed",
  });

export const ListTemplates = (token: string) =>
  apiRequest({
    method: "get",
    url: "/resume/templates",
    token,
    errorMessage: "Templates Fetch failed",
  });