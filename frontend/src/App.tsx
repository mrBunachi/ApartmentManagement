import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import AdminManagement from './pages/admin/AdminManagement';
import ProfileView from './pages/profile/ProfileView';
import ProfileEdit from './pages/profile/ProfileEdit';
import ChangePassword from './pages/profile/ChangePassword';
import ResidentManagement from './pages/residents/ResidentManagement';
import FixedFeeManagement from './pages/fees/FixedFeeManagement';
import HouseholdManagement from './pages/households/HouseholdManagement';
import ResidencyHistoryManagement from './pages/residency-history/ResidencyHistoryManagement';
import TamTruManagement from './pages/temporary-residence/TamTruManagement';
import TamVangManagement from './pages/temporary-absence/TamVangManagement';
import DotThuPhiManagement from './pages/fee-collection/DotThuPhiManagement';
import DotThuPhiDetail from './pages/fee-collection/DotThuPhiDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/residents" element={<ResidentManagement />} />
                    <Route path="/households" element={<HouseholdManagement />} />
                    <Route path="/residency-history" element={<ResidencyHistoryManagement />} />
                    <Route path="/tam-tru" element={<TamTruManagement />} />
                    <Route path="/tam-vang" element={<TamVangManagement />} />
                    <Route path="/dot-thu-phi" element={<DotThuPhiManagement />} />
                    <Route path="/dot-thu-phi/:id" element={<DotThuPhiDetail />} />
                    <Route path="/fees" element={<FixedFeeManagement />} />
                    <Route path="/admins" element={<AdminManagement />} />
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/profile/change-password" element={<ChangePassword />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
