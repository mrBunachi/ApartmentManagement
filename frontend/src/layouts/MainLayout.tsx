import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' },
    { id: 'residents', label: 'Quản lý Dân cư', icon: '👥', path: '/residents' },
    { id: 'households', label: 'Quản lý Hộ khẩu', icon: '🏘️', path: '/households' },
    { id: 'residency-history', label: 'Lịch sử Cư trú', icon: '📜', path: '/residency-history' },
    { id: 'tam-tru', label: 'Quản lý Tạm trú', icon: '📝', path: '/tam-tru' },
    { id: 'tam-vang', label: 'Quản lý Tạm vắng', icon: '✈️', path: '/tam-vang' },
    { id: 'dot-thu-phi', label: 'Quản lý Đợt thu', icon: '📋', path: '/dot-thu-phi' },
    { id: 'fees', label: 'Quản lý Phí cố định', icon: '💰', path: '/fees' },
    { id: 'admins', label: 'Quản lý Admin', icon: '👤', path: '/admins' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">🏢 Quản Lý Chung Cư</h1>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find(m => isActive(m.path))?.label || 'Dashboard'}
              </h2>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.HOTEN?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.HOTEN}</p>
                  <p className="text-xs text-gray-500">{user?.VAITRO}</p>
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-20">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                  >
                    <span>👁️</span> Xem thông tin
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile/edit');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                  >
                    <span>✏️</span> Thay đổi thông tin
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile/change-password');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                  >
                    <span>🔒</span> Đổi mật khẩu
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                  >
                    <span>🚪</span> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
}
