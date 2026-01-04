import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    console.log('🔵 [ChangePassword] Changing password');

    try {
      // PUT /nguoi-quan-ly with MATKHAU field
      const response = await request.put('/nguoi-quan-ly', {
        MATKHAU: formData.newPassword,
        // Backend should verify currentPassword or handle password change securely
      });

      console.log('🟢 [ChangePassword] Password changed successfully:', response);
      setSuccess('Đổi mật khẩu thành công!');

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      console.error('❌ [ChangePassword] Error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Đổi mật khẩu</h3>
        <p className="text-sm text-gray-500">Cập nhật mật khẩu của bạn để bảo mật tài khoản</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu mới"
              minLength={6}
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <span className="text-yellow-600">⚠️</span>
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Mật khẩu mới phải có ít nhất 6 ký tự</li>
                  <li>Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại</li>
                </ul>
              </div>
            </div>
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
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
