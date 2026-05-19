import { ISODateTime, UUID } from "./common";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserAuthenticatedResponse {
  id: UUID;
  email: string;
  created_at: ISODateTime;
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface DecodedToken {
  sub: string;
  email: string;
  exp_at: string;
  exp: number;
}

export interface User {
  id: UUID;
  email: string;
  created_at?: ISODateTime;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (response: UserAuthenticatedResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
