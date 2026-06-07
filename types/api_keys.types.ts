export enum ProviderType {
  GROQ = "groq",
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  GOOGLE = "google",
  COHERE = "cohere",
  MISTRAL = "mistral",
  OTHER = "other",
}

export interface CreateApiKeyRequest {
  provider: ProviderType;
  key_name: string;
  key_value: string;

  api_base_url?: string;
  api_version?: string;

  is_active?: boolean;
  isDefault?: boolean;

  expires_at?: string;
}

export interface UpdateApiKeyRequest {
  provider?: ProviderType;
  key_name?: string;
  key_value?: string;

  api_base_url?: string;
  api_version?: string;

  is_active?: boolean;
  isDefault?: boolean;

  expires_at?: string;
}

export interface ApiKey {
  id: string;
  userId: string;

  provider: ProviderType;

  key_name: string;
  key_value: string;

  api_base_url?: string;
  api_version?: string;

  last_used_at?: string;

  total_requests: number;

  is_active: boolean;

  expires_at?: string;

  created_at: string;
  updated_at?: string;

  isDefault: boolean;
}