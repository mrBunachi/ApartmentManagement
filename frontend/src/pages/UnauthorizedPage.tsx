import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Không có quyền truy cập</h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên hoặc đăng nhập với tài khoản có quyền phù hợp.
        </p>

        {/* User Info */}
        {user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Bạn đang đăng nhập với:</p>
            <p className="font-semibold text-gray-900">{user.HOTEN}</p>
            <p className="text-sm text-gray-600">
              Vai trò: <span className="font-medium">{user.VAITRO === 'admin_1' ? 'Admin' : 'Ban quản lý'}</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ← Quay lại
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Về trang chủ
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 font-medium py-2 transition-colors text-sm"
          >
            Đăng xuất và đăng nhập lại
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
}
