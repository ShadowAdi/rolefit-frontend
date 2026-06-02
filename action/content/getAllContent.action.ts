import { GeneratedDocumentResponse } from "@/types";
import { apiRequest } from "../_apiRequest";

export const GetAllGeneratedContentAction = (token: string) =>
  apiRequest<GeneratedDocumentResponse[]>({
    method: "get",
    url: "/content/all",
    token,
    errorMessage: "Failed to fetch all generated content",
  });
