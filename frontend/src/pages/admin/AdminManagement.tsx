import { useEffect, useState } from 'react';
import { adminService } from '../../api/admin.service';
import type { CreateAdminRequest, UpdateAdminRequest } from '../../api/admin.service';
import type { User } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

export default function AdminManagement() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    TENDANGNHAP: '',
    HOTEN: '',
    SODIENTHOAI: '',
    EMAIL: '',
    VAITRO: 'admin_2',
    ACTIVATE: true,
    MATKHAU: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getAll();
      setAdmins(response.users.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách admin');
      console.error('❌ Load admins error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedAdmin(null);
    setFormData({
      TENDANGNHAP: '',
      HOTEN: '',
      SODIENTHOAI: '',
      EMAIL: '',
      VAITRO: 'admin_2',
      ACTIVATE: true,
      MATKHAU: '',
    });
    setShowModal(true);
  };

  const handleEdit = (admin: User) => {
    setModalMode('edit');
    setSelectedAdmin(admin);
    setFormData({
      TENDANGNHAP: admin.TENDANGNHAP,
      HOTEN: admin.HOTEN,
      SODIENTHOAI: admin.SODIENTHOAI,
      EMAIL: admin.EMAIL || '',
      VAITRO: admin.VAITRO || 'admin_2',
      ACTIVATE: admin.ACTIVATE,
      MATKHAU: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (modalMode === 'create') {
        const createData: CreateAdminRequest = {
          user: formData.TENDANGNHAP,
          name: formData.HOTEN,
          password: formData.MATKHAU,
          phone_number: formData.SODIENTHOAI,
          email: formData.EMAIL || null,
          role: formData.VAITRO,
        };
        await adminService.create(createData);
      } else if (selectedAdmin) {
        const updateData: UpdateAdminRequest = {
          TENDANGNHAP: formData.TENDANGNHAP,
          HOTEN: formData.HOTEN,
          SODIENTHOAI: formData.SODIENTHOAI,
          EMAIL: formData.EMAIL || null,
          VAITRO: formData.VAITRO,
          ACTIVATE: formData.ACTIVATE,
        };
        if (formData.MATKHAU) {
          updateData.MATKHAU = formData.MATKHAU;
        }
        await adminService.update(selectedAdmin.id, updateData);
      }

      setShowModal(false);
      loadAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra');
      console.error('❌ Submit error:', err);
    }
  };

  const handleDelete = async (admin: User) => {
    if (!window.confirm(`Bạn có chắc muốn xóa admin "${admin.HOTEN}"?`)) return;

    try {
      await adminService.delete(admin.id);
      loadAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa admin');
      console.error('❌ Delete error:', err);
    }
  };

  const isAdmin1 = currentUser?.VAITRO === 'admin_1';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Danh sách Admin</h3>
          <p className="text-sm text-gray-500">Quản lý tài khoản quản trị viên hệ thống</p>
        </div>
        {isAdmin1 && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <span> </span> Thêm Admin
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên đăng nhập</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              {isAdmin1 && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.TENDANGNHAP}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.HOTEN}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.SODIENTHOAI}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.EMAIL || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admin.VAITRO === 'admin_1' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {admin.VAITRO}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admin.ACTIVATE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.ACTIVATE ? 'Hoạt động' : 'Vô hiệu hóa'}
                  </span>
                </td>
                {isAdmin1 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      ✏️ Sửa
                    </button>
                    {admin.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(admin)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">
              {modalMode === 'create' ? 'Thêm Admin Mới' : 'Chỉnh Sửa Admin'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.TENDANGNHAP}
                  onChange={(e) => setFormData({ ...formData, TENDANGNHAP: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.HOTEN}
                  onChange={(e) => setFormData({ ...formData, HOTEN: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.SODIENTHOAI}
                  onChange={(e) => setFormData({ ...formData, SODIENTHOAI: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.EMAIL}
                  onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.VAITRO}
                  onChange={(e) => setFormData({ ...formData, VAITRO: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="admin_1">admin_1</option>
                  <option value="admin_2">admin_2</option>
                  <option value="admin_3">admin_3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu {modalMode === 'create' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  required={modalMode === 'create'}
                  value={formData.MATKHAU}
                  onChange={(e) => setFormData({ ...formData, MATKHAU: e.target.value })}
                  placeholder={modalMode === 'edit' ? 'Để trống nếu không đổi' : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.ACTIVATE}
                  onChange={(e) => setFormData({ ...formData, ACTIVATE: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">Kích hoạt tài khoản</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {modalMode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
