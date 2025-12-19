import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';
import DashboardHome from '../pages/dashboard/DashboardHome';
import NhanKhauList from '../pages/nhanKhau/NhanKhauList';
import NhanKhauForm from '../pages/nhanKhau/NhanKhauForm';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/ProtectedRouted';
import HoKhauList from '../pages/hoKhau/HoKhauList';
import HoKhauForm from '../pages/hoKhau/HoKhauForm';
import DotThuPhiList from '../pages/dotThuPhi/DotThuPhiList';
import DotThuPhiForm from '../pages/dotThuPhi/DotThuPhiForm';
import DongGopList from '../pages/dongGop/DongGopList';
import DongGopForm from '../pages/dongGop/DongGopForm';
import TamTruList from '../pages/tamTru/TamTruList';
import TamTruForm from '../pages/tamTru/TamTruForm';
import TamVangList from '../pages/tamVang/TamVangList';
import TamVangForm from '../pages/tamVang/TamVangForm';

// Import các trang khác tương tự (Hộ khẩu, tạm trú...)
// Để tiết kiệm thời gian, bạn import dần khi tạo file xong.

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardHome /> },

          // NHÂN KHẨU
          { path: 'nhan-khau', element: <NhanKhauList /> },
          { path: 'nhan-khau/create', element: <NhanKhauForm /> },
          { path: 'nhan-khau/edit/:id', element: <NhanKhauForm /> },

          // HỘ KHẨU (Copy y hệt pattern trên)
          // { path: 'ho-khau', element: <HoKhauList /> }, ...
          { path: 'ho-khau', element: <HoKhauList /> },
          { path: 'ho-khau/create', element: <HoKhauForm /> },
          { path: 'ho-khau/edit/:id', element: <HoKhauForm /> },

          // ĐỢT THU PHÍ
          { path: 'dot-thu-phi', element: <DotThuPhiList /> },
          { path: 'dot-thu-phi/create', element: <DotThuPhiForm /> },
          { path: 'dot-thu-phi/edit/:id', element: <DotThuPhiForm /> },

          // ĐÓNG GÓP
          { path: 'dong-gop', element: <DongGopList /> },
          { path: 'dong-gop/create', element: <DongGopForm /> },
          // Đóng góp thường ít khi sửa, chỉ cần xóa đi nhập lại, nên ko cần route edit gấp
          // TẠM TRÚ
          { path: 'tam-tru', element: <TamTruList /> },
          { path: 'tam-tru/create', element: <TamTruForm /> },

          // TẠM VẮNG
          { path: 'tam-vang', element: <TamVangList /> },
          { path: 'tam-vang/create', element: <TamVangForm /> },
        ],
      },
    ],
  },
]);