import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar'; // Import component Topbar vừa sửa

export default function AdminLayout() {
  // Không cần useAuth ở đây nữa vì Topbar đã lo nút Logout rồi
  
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 1. Sidebar bên trái */}
      <Sidebar />

      {/* 2. Khu vực bên phải (Chia dọc: Topbar ở trên, Nội dung ở dưới) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Topbar nằm cố định ở trên */}
        <Topbar />

        {/* Khu vực nội dung thay đổi (có thanh cuộn riêng) */}
        <div style={{ flex: 1, padding: 20, overflow: 'auto', backgroundColor: '#f5f7fa' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}