import {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
} from "@/types/api_keys.types";
import { apiRequest } from "../_apiRequest";

export const ApiKeyCreateAction = (
  payload: CreateApiKeyRequest,
  token: string,
) =>
  apiRequest<ApiKey>({
    method: "post",
    url: "/api-keys",
    token,
    body: payload,
    errorMessage: "Api Key creation failed",
  });

export const ApiKeyGetAllAction = (token: string) =>
  apiRequest<ApiKey[]>({
    method: "get",
    url: "/api-keys",
    token,
    errorMessage: "Api Key fetch failed",
  });

export const ApiKeyGetAction = (keyId: string, token: string) =>
  apiRequest<ApiKey>({
    method: "get",
    url: "/api-keys/" + keyId,
    token,
    errorMessage: "Api Key fetch failed",
  });

export const ApiKeyUpdateAction = (
  payload: UpdateApiKeyRequest,
  keyId: string,
  token: string,
) =>
  apiRequest<ApiKey>({
    method: "patch",
    url: "/api-keys/" + keyId,
    token,
    body: payload,
    errorMessage: "Api Key update failed",
  });

export const ApiKeyDeleteAction = (keyId: string, token: string) =>
  apiRequest<ApiKey>({
    method: "delete",
    url: "/api-keys/" + keyId,
    token,
    errorMessage: "Api Key delete failed",
  });
