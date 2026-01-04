import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/auth.service';
import type { User } from '../../types/auth';

export default function ProfileView() {
  const navigate = useNavigate();
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<User | null>(contextUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📋 ProfileView - Loading user data');
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('🔵 [ProfileView] Fetching user data from /nguoi-quan-ly/me');
      const response = await authService.getMe();
      console.log('🟢 [ProfileView] User data received:', response);
      setUser(response.user);
    } catch (error) {
      console.error('❌ [ProfileView] Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Không thể tải thông tin người dùng
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Thông tin tài khoản</h3>
          <p className="text-sm text-gray-500">Chi tiết thông tin cá nhân của bạn</p>
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <span>✏️</span> Chỉnh sửa
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user.HOTEN?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.HOTEN}</h2>
              <p className="text-gray-500">{user.TENDANGNHAP}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                user.VAITRO === 'admin_1' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user.VAITRO}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
              <p className="text-gray-900 font-medium">{user.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Tên đăng nhập</label>
              <p className="text-gray-900 font-medium">{user.TENDANGNHAP}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Họ tên</label>
              <p className="text-gray-900 font-medium">{user.HOTEN}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
              <p className="text-gray-900 font-medium">{user.SODIENTHOAI}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900 font-medium">{user.EMAIL || <span className="text-gray-400">Chưa cập nhật</span>}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vai trò</label>
              <p className="text-gray-900 font-medium">{user.VAITRO}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Trạng thái</label>
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                user.ACTIVATE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.ACTIVATE ? '✅ Hoạt động' : '❌ Vô hiệu hóa'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={() => navigate('/profile/edit')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Chỉnh sửa thông tin
          </button>
          <button
            onClick={() => navigate('/profile/change-password')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
