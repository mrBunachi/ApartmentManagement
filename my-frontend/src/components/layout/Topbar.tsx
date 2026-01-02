import { useAuth } from "../../hooks/useAuth";
import axios from 'axios';
import { API_URL } from '../../utils/constants';

export default function Topbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Gọi API logout để xóa cookies
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Luôn gọi logout local dù API có lỗi
      logout();
    }
  };

  return (
    <div style={{ 
      height: 60, 
      borderBottom: '1px solid #ccc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 20px',
      background: '#fff'
    }}>
      <h3 style={{ margin: 0, color: '#333' }}>Quản Lý Chung Cư</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <span style={{ fontSize: 14 }}>
          Xin chào, <b>{user?.name || user?.username || 'Admin'}</b>
        </span>
        
        <button 
          onClick={handleLogout} 
          style={{ 
            padding: '8px 16px', 
            background: '#dc3545',
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}