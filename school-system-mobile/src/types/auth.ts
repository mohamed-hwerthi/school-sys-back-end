export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DIRECTEUR' | 'ENSEIGNANT' | 'COMPTABLE' | 'PARENT';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
  // 2FA fields
  twoFactorRequired: boolean;
  twoFactorUserId: number | null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// 2FA types
export interface Enable2FAResponse {
  secret: string;
  qrCodeUri: string;
}

export interface Verify2FARequest {
  code: string;
}

export interface Verify2FALoginRequest {
  userId: number;
  code: string;
}

// Session management types
export interface Session {
  id: number;
  deviceName: string;
  ipAddress: string;
  lastUsedAt: string;
  createdAt: string;
  current: boolean;
}
