import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { TOKEN_KEY } from '../utils/constants';

// Định nghĩa key để lưu user info vào localStorage
const USER_INFO_KEY = 'user_info';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Thêm biến user để chứa thông tin (username, role...)
  login: (token: string, userInfo: any) => void; // Hàm login nhận thêm userInfo
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Khởi tạo state isAuthenticated từ localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(TOKEN_KEY));

  // 2. Khởi tạo state User từ localStorage (để F5 không bị mất)
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem(USER_INFO_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 3. Hàm Login: Nhận Token + Thông tin User
  const login = (token: string, userInfo: any) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo)); // Lưu user dạng chuỗi JSON
    
    setIsAuthenticated(true);
    setUser(userInfo); // Cập nhật state
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY); // Xóa user info khi đăng xuất
    
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};