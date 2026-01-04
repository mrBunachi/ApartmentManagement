// User type từ backend
export interface User {
  id: number;
  TENDANGNHAP: string;
  HOTEN: string;
  SODIENTHOAI: string;
  EMAIL: string | null;
  VAITRO: string | null;
  ACTIVATE: boolean;
}

// Login request
export interface LoginRequest {
  identifier: string; // username hoặc email
  password: string;
}

// Auth response
export interface AuthResponse {
  message: string;
}

// User info response
export interface UserInfoResponse {
  message: string;
  user: User;
}
