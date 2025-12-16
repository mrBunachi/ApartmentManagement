import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';
import DashboardHome from '../pages/dashboard/DashboardHome';
import NhanKhauList from '../pages/nhanKhau/NhanKhauList';
import NhanKhauForm from '../pages/nhanKhau/NhanKhauForm';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/ProtectedRouted';

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
        ],
      },
    ],
  },
]);