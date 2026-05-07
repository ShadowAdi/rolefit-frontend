// Login/Authentication Response from API
export interface UserAuthenticatedResponse {
  id: string;
  email: string;
  created_at: string;
  access_token: string;
  token_type: "bearer";
  expires_in: number; // in seconds
}

// Decoded JWT Payload
export interface DecodedToken {
  sub: string; // user_id
  email: string;
  exp_at: string; // ISO format timestamp
  exp: number; // Unix timestamp in seconds
}

// User object for context
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

// Auth Context type
export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (response: UserAuthenticatedResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
