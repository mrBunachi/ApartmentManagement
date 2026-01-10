import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      // Sẽ redirect trong useEffect sau khi user được set
    } catch (err: any) {
      const backendError = err.response?.data?.error || err.response?.data?.message;
      
      let errorMsg = 'Đăng nhập thất bại. Vui lòng thử lại.';
      if (backendError === 'User not found') {
        errorMsg = 'Tên đăng nhập hoặc email không tồn tại.';
      } else if (backendError === 'Invalid credentials') {
        errorMsg = 'Mật khẩu không chính xác.';
      } else if (backendError) {
        errorMsg = backendError;
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  // Redirect dựa trên role sau khi login thành công
  if (user) {
    if (user.VAITRO === 'admin_1') {
      navigate('/admins', { replace: true });
    } else if (user.VAITRO === 'admin_2') {
      navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Đăng Nhập Hệ Thống
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Quản lý chung cư
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Tên đăng nhập hoặc Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập tên đăng nhập hoặc email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </div>
        </form>

        {/* Resident Portal Link */}
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/resident/login')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-blue-500 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Cổng thông tin Cư dân
          </button>
        </div>
      </div>
    </div>
  );
}
