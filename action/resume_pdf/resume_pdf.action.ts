import { apiRequest } from "../_apiRequest";

export const DownloadResumePdfAction = (docId: string, token: string) =>
  apiRequest({
    method: "get",
    url: "/resume/" + docId + "/download",
    token,
    errorMessage: "Download Resume pdf failed",
  });

export const ListTemplates = (token: string) =>
  apiRequest({
    method: "get",
    url: "/resume/templates",
    token,
    errorMessage: "Templates Fetch failed",
  });
