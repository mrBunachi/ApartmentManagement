import { Link } from 'react-router-dom';

const menus = [
  { path: '/', label: 'Dashboard' },
  { path: '/nhan-khau', label: 'Nhân Khẩu' },
  { path: '/ho-khau', label: 'Hộ Khẩu' },
  { path: '/tam-tru', label: 'Tạm Trú' },
  { path: '/tam-vang', label: 'Tạm Vắng' },
  { path: '/dot-thu-phi', label: 'Đợt Thu Phí' },
  { path: '/dong-gop', label: 'Đóng Góp' },
];

export default function Sidebar() {
  return (
    <div style={{ width: 250, borderRight: '1px solid #ccc', height: '100vh', padding: 20 }}>
      <h3>Quản Lý Dân Cư</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menus.map((m) => (
          <li key={m.path} style={{ marginBottom: 10 }}>
            <Link to={m.path}>{m.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}