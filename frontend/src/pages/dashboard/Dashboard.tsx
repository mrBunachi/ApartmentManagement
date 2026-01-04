import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chào mừng trở lại, {user?.HOTEN}!
        </h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống quản lý chung cư</p>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">Thông tin Quản trị viên</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.HOTEN?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{user?.HOTEN}</p>
                <p className="text-xs text-gray-600">{user?.EMAIL || 'Chưa cập nhật email'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-700 font-medium">Số điện thoại</span>
              </div>
              <span className="text-sm font-bold text-blue-700">{user?.SDT || 'Chưa cập nhật'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700 font-medium">Tên đăng nhập</span>
              </div>
              <span className="text-sm font-bold text-blue-700">{user?.TENDANGNHAP}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-900">Thông tin hệ thống</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <span className="text-sm text-gray-700 font-medium">Phiên bản</span>
              <span className="text-sm font-bold text-purple-700">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <span className="text-sm text-gray-700 font-medium">Người quản lý</span>
              <span className="text-sm font-bold text-purple-700">{user?.HOTEN}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <span className="text-sm text-gray-700 font-medium">Vai trò</span>
              <span className="text-sm font-bold text-purple-700">{user?.VAITRO || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
