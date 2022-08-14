export type AuthStatus = 'Authenticated' | 'Guest' | 'Loading';

export type Session = {
  email?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  permissions?: string[];
  username: string;
};

export type AuthState = {
  status: AuthStatus;
  currentUser: Session | null;
  isAdmin: boolean;
};

export type LoginResponse = {
  permissions?: string[];
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  refresh_expires_in?: number;
  token_type?: string;
  session_state?: string;
  username: string;
};

export type UserRefreshTokenResponse = {
  token: string;
  refresh_token: string;
  expiresIn: number;
};
