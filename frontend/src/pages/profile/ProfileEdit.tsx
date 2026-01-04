import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import request from '../../utils/request';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    TENDANGNHAP: '',
    HOTEN: '',
    SODIENTHOAI: '',
    EMAIL: '',
  });

  useEffect(() => {
    console.log('📝 ProfileEdit - Loading user data');
    if (user) {
      setFormData({
        TENDANGNHAP: user.TENDANGNHAP || '',
        HOTEN: user.HOTEN || '',
        SODIENTHOAI: user.SODIENTHOAI || '',
        EMAIL: user.EMAIL || '',
      });
      console.log('🟢 Form data initialized:', { TENDANGNHAP: user.TENDANGNHAP, HOTEN: user.HOTEN });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccessToast(false);
    setLoading(true);

    console.log('🔵 [ProfileEdit] Submitting update:', formData);

    try {
      // PUT /nguoi-quan-ly (update own profile)
      const response = await request.put('/nguoi-quan-ly', {
        TENDANGNHAP: formData.TENDANGNHAP,
        HOTEN: formData.HOTEN,
        SODIENTHOAI: formData.SODIENTHOAI,
        EMAIL: formData.EMAIL || null,
      });

      console.log('🟢 [ProfileEdit] Update successful:', response);
      
      // Show success toast
      setShowSuccessToast(true);

      // Refresh user data
      await checkAuth();

      // Auto hide toast and redirect after 5 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/profile');
      }, 5000);
    } catch (err: any) {
      console.error('❌ [ProfileEdit] Update error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Chỉnh sửa thông tin</h3>
        <p className="text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.TENDANGNHAP}
              onChange={(e) => setFormData({ ...formData, TENDANGNHAP: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.HOTEN}
              onChange={(e) => setFormData({ ...formData, HOTEN: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.SODIENTHOAI}
              onChange={(e) => setFormData({ ...formData, SODIENTHOAI: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.EMAIL}
              onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast Popup */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Thành công!</p>
              <p className="text-sm text-green-100">Cập nhật thông tin thành công!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
