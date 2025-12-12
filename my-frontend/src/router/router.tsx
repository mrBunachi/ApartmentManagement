import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardHome from "../pages/dashboard/DashboardHome";
import NhanKhauList from "../pages/nhanKhau/NhanKhauList";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";


const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "nhankhau", element: <NhanKhauList /> },
    ],
  },
]);


export default router;