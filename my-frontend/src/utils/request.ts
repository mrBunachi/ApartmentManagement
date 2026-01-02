import axios from 'axios';
import { API_URL, TOKEN_KEY } from './constants';

const request = axios.create({ 
  baseURL: API_URL,
  withCredentials: true // QUAN TRỌNG: Cho phép gửi/nhận cookies từ backend
});

// Backend dùng cookie-based auth, không cần Authorization header
request.interceptors.request.use((config) => {
  // Không cần gắn token vào header nữa vì dùng httpOnly cookies
  return config;
});

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      // Xóa thông tin user khi unauthorized
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
export default request;