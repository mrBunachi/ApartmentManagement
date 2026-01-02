import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

export default function Login() {
  const { login, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Gọi API login thật
      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password
      }, {
        withCredentials: true // Quan trọng: cho phép gửi/nhận cookies
      });

      // Backend trả về cookies, không trả token trong response
      // Lấy thông tin user từ API /nguoi-quan-ly
      const userResponse = await axios.get(`${API_URL}/nguoi-quan-ly`, {
        withCredentials: true
      });

      const userInfo = userResponse.data.users[0] || {};
      
      // Login với "cookie-auth" flag và user info
      login('cookie-auth', {
        username: userInfo.TENDANGNHAP,
        name: userInfo.HOTEN,
        role: userInfo.VAITRO,
        email: userInfo.EMAIL,
        id: userInfo.id
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={handleLogin} style={{ padding: 40, border: '1px solid #ddd', borderRadius: 8, backgroundColor: 'white', minWidth: 350 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Đăng Nhập Hệ Thống</h2>
        
        {error && (
          <div style={{ padding: 10, marginBottom: 15, backgroundColor: '#fee', color: '#c33', borderRadius: 4, fontSize: 14 }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Tên đăng nhập hoặc Email:</label>
          <input 
            value={identifier} 
            onChange={e=>setIdentifier(e.target.value)}
            required
            disabled={loading}
            style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
            placeholder="Nhập username hoặc email"
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
            placeholder="Nhập mật khẩu"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: 12, 
            backgroundColor: loading ? '#999' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4, 
            fontSize: 16, 
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
      </form>
    </div>
  );
}