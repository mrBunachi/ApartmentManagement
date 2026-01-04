import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/auth.service';

export default function Dashboard() {
  const { user } = useAuth();
  const [detailedUser, setDetailedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedUserInfo = async () => {
      try {
        console.log('📊 Fetching detailed user info...');
        const response = await authService.getMe();
        console.log('👤 Detailed User Info:', response);
        setDetailedUser(response.user);
      } catch (error) {
        console.error('❌ Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Xin chào, {user?.HOTEN}! 👋</h2>
        <p className="text-indigo-100">Chào mừng bạn đến với hệ thống quản lý chung cư</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng dân cư</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Hộ khẩu</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="text-3xl">🏘️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tạm trú</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="text-3xl">��</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Thu phí tháng này</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* User Detail Info */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết tài khoản</h3>
        </div>
        <div className="p-6">
          {detailedUser ? (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{detailedUser.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tên đăng nhập</dt>
                <dd className="mt-1 text-sm text-gray-900">{detailedUser.TENDANGNHAP}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Họ tên</dt>
                <dd className="mt-1 text-sm text-gray-900">{detailedUser.HOTEN}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    detailedUser.VAITRO === 'admin_1' 
                      ? 'bg-purple-100 text-purple-800'
                      : detailedUser.VAITRO === 'admin_2'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {detailedUser.VAITRO}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{detailedUser.EMAIL || 'Chưa cập nhật'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                <dd className="mt-1 text-sm text-gray-900">{detailedUser.SODIENTHOAI}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    detailedUser.ACTIVATE 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {detailedUser.ACTIVATE ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-500">Đang tải thông tin...</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
            <span className="text-xl">➕</span>
            <span className="font-medium text-indigo-700">Thêm dân cư</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
            <span className="text-xl">📋</span>
            <span className="font-medium text-green-700">Thu phí mới</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
            <span className="text-xl">📊</span>
            <span className="font-medium text-purple-700">Báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
