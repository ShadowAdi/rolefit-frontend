import {
  PublicationCreateRequest,
  PublicationCreateResponse,
  PublicationDeleteResponse,
  PublicationGetResponse,
  PublicationListResponse,
  PublicationUpdateRequest,
  PublicationUpdateResponse,
} from "@/types";
import { apiRequest } from "../_apiRequest";

export const CreatePublication = (
  payload: PublicationCreateRequest,
  token: string,
) =>
  apiRequest<PublicationCreateResponse>({
    method: "post",
    url: "/publications/",
    token,
    body: payload,
    errorMessage: "Publication creation failed",
  });

export const GetAllPublications = (token: string) =>
  apiRequest<PublicationListResponse[]>({
    method: "get",
    url: "/publications/",
    token,
    errorMessage: "Publication fetched failed",
  });

export const GetPublication = (pubId: string, token: string) =>
  apiRequest<PublicationGetResponse>({
    method: "get",
    url: `/publications/${pubId}`,
    token,
    errorMessage: "Publication fetched failed",
  });

export const UpdatePublication = (
  pubId: string,
  payload: PublicationUpdateRequest,
  token: string,
) =>
  apiRequest<PublicationUpdateResponse>({
    method: "patch",
    url: `/publications/${pubId}`,
    token,
    body: payload,
    errorMessage: "Publication updated failed",
  });

export const DeletePublication = (pubId: string, token: string) =>
  apiRequest<PublicationDeleteResponse>({
    method: "delete",
    url: `/publications/${pubId}`,
    token,
    errorMessage: "Publication deleted failed",
  });
