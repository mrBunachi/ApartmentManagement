import { useState, useEffect } from 'react'; // 1. Import thêm useEffect
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // 2. Lấy thêm biến isAuthenticated từ hook
  const { login, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  // 3. Thêm đoạn này: Nếu đã đăng nhập thì đá về trang chủ ngay lập tức
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // Code fake check
    if(user === 'admin' && pass === '1') {
        const fakeUserInfo = {username: 'admin', role: 'quan_tri_vien', hoTen: 'Nguyễn Văn Admin'}
        login('fake-token-123', fakeUserInfo);
        navigate('/');
    } else {
        alert('Sai mật khẩu (Thử: admin / 1)');
    }
  };

  // Nếu đang redirect thì không cần render form để tránh nháy giao diện
  if (isAuthenticated) return null; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
      <form onSubmit={handleLogin} style={{ padding: 20, border: '1px solid black' }}>
        <h2>Đăng Nhập</h2>
        <div><label>User:</label><br/><input value={user} onChange={e=>setUser(e.target.value)} /></div>
        <div style={{marginTop: 10}}><label>Pass:</label><br/><input type="password" value={pass} onChange={e=>setPass(e.target.value)} /></div>
        <button type="submit" style={{ marginTop: 20 }}>Login</button>
      </form>
    </div>
  );
}