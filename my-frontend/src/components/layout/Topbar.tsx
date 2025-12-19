import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  // Lấy thêm biến user để hiển thị tên
  const { user, logout } = useAuth();

  return (
    <div style={{ 
      height: 60, 
      borderBottom: '1px solid #ccc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 20px',
      background: '#fff' // Đổi màu nền trắng cho sạch
    }}>
      {/* Bên trái: Tên App */}
      <h3 style={{ margin: 0, color: '#333' }}>Quản Lý Dân Cư</h3>

      {/* Bên phải: Thông tin User & Nút Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <span style={{ fontSize: 14 }}>
          Xin chào, <b>{user?.hoTen || user?.username || 'Admin'}</b>
        </span>
        
        <button 
          onClick={logout} 
          style={{ 
            padding: '5px 15px', 
            background: '#dc3545', // Màu đỏ báo hiệu nút thoát
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}