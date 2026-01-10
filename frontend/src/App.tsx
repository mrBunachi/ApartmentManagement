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
import ResidentLogin from './pages/resident-portal/ResidentLogin';
import ResidentDashboard from './pages/resident-portal/ResidentDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Resident Portal Routes */}
          <Route path="/resident/login" element={<ResidentLogin />} />
          <Route path="/resident/dashboard" element={<ResidentDashboard />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    {/* Routes cho admin_1 - Chỉ quản lý Admin */}
                    <Route 
                      path="/admins" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_1']}>
                          <AdminManagement />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Routes cho admin_2 - Quản lý vận hành */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/residents" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <ResidentManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/households" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <HouseholdManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/residency-history" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <ResidencyHistoryManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tam-tru" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <TamTruManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tam-vang" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <TamVangManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dot-thu-phi" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <DotThuPhiManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dot-thu-phi/:id" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <DotThuPhiDetail />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/fees" 
                      element={
                        <ProtectedRoute allowedRoles={['admin_2']}>
                          <FixedFeeManagement />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Profile routes - Cho phép cả 2 role */}
                    <Route path="/profile" element={<ProfileView />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/profile/change-password" element={<ChangePassword />} />
                    
                    {/* Redirect mặc định dựa vào role */}
                    <Route path="*" element={<Navigate to="/unauthorized" replace />} />
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
