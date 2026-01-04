import { useState, useEffect } from 'react';
import tamVangService from '../../api/tamVang.service';
import residentService from '../../api/resident.service';
import type { TamVang, CreateTamVangRequest } from '../../api/tamVang.service';
import type { Resident } from '../../api/resident.service';
import { toast } from 'react-hot-toast';

const TamVangManagement = () => {
  const [tamVangs, setTamVangs] = useState<TamVang[]>([]);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTamVang, setSelectedTamVang] = useState<TamVang | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateTamVangRequest>({
    MANHANKHAU: 0,
    NOITAMTRU: '',
    TUNGAY: '',
    DENNGAY: '',
    LYDO: '',
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchTamVangs();
    fetchAllResidents();
  }, [page]);

  const fetchTamVangs = async () => {
    try {
      setLoading(true);
      const response = await tamVangService.getAll({ page, limit });
      setTamVangs(response.data.tamVangs || []);
      setTotalPages(Math.ceil(response.data.count / limit));
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách tạm vắng');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResidents = async () => {
    try {
      const response = await residentService.getAll({ ACTIVATE: true, limit: 10000 });
      setAllResidents(response.residents.residents || []);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách cư dân');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (tamVang: TamVang) => {
    setSelectedTamVang(tamVang);
    setFormData({
      MANHANKHAU: tamVang.MANHANKHAU,
      NOITAMTRU: tamVang.NOITAMTRU || '',
      TUNGAY: tamVang.TUNGAY ? new Date(tamVang.TUNGAY).toISOString().split('T')[0] : '',
      DENNGAY: tamVang.DENNGAY ? new Date(tamVang.DENNGAY).toISOString().split('T')[0] : '',
      LYDO: tamVang.LYDO || '',
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    try {
      if (!formData.MANHANKHAU) {
        toast.error('Vui lòng chọn nhân khẩu');
        return;
      }

      await tamVangService.create(formData);
      toast.success('Đăng ký tạm vắng thành công');
      setShowCreateModal(false);
      resetForm();
      fetchTamVangs();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đăng ký tạm vắng');
    }
  };

  const handleUpdate = async () => {
    if (!selectedTamVang) return;

    try {
      await tamVangService.update(selectedTamVang.MADANGKYTAMVANG, formData);
      toast.success('Cập nhật thông tin tạm vắng thành công');
      setShowEditModal(false);
      resetForm();
      fetchTamVangs();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật tạm vắng');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đăng ký tạm vắng này?')) return;

    try {
      await tamVangService.delete(id);
      toast.success('Xóa đăng ký tạm vắng thành công');
      fetchTamVangs();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa tạm vắng');
    }
  };

  const resetForm = () => {
    setFormData({
      MANHANKHAU: 0,
      NOITAMTRU: '',
      TUNGAY: '',
      DENNGAY: '',
      LYDO: '',
    });
    setSelectedTamVang(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Tạm vắng</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Đăng ký tạm vắng mới
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã ĐK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nơi tạm trú</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tamVangs.map((tamVang) => (
                <tr key={tamVang.MADANGKYTAMVANG} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{tamVang.MADANGKYTAMVANG}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tamVang.NHANKHAU ? (
                      <div>
                        <div className="font-medium">{tamVang.NHANKHAU.HOTEN}</div>
                        <div className="text-gray-500 text-xs">{tamVang.NHANKHAU.SOCANCUOC}</div>
                      </div>
                    ) : (
                      tamVang.MANHANKHAU
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{tamVang.NOITAMTRU || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(tamVang.TUNGAY)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(tamVang.DENNGAY)}</td>
                  <td className="px-6 py-4 text-sm">{tamVang.LYDO || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => openEditModal(tamVang)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(tamVang.MADANGKYTAMVANG)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tamVangs.length === 0 && (
            <div className="text-center py-8 text-gray-500">Chưa có đăng ký tạm vắng nào</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Đăng ký tạm vắng mới</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nhân khẩu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.MANHANKHAU}
                  onChange={(e) => setFormData({ ...formData, MANHANKHAU: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>-- Chọn nhân khẩu --</option>
                  {allResidents.map((resident) => (
                    <option key={resident.MANHANKHAU} value={resident.MANHANKHAU}>
                      {resident.HOTEN} - {resident.SOCANCUOC}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nơi tạm trú</label>
                <input
                  type="text"
                  value={formData.NOITAMTRU}
                  onChange={(e) => setFormData({ ...formData, NOITAMTRU: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Địa chỉ nơi tạm trú"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={formData.TUNGAY}
                  onChange={(e) => setFormData({ ...formData, TUNGAY: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={formData.DENNGAY}
                  onChange={(e) => setFormData({ ...formData, DENNGAY: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lý do</label>
                <textarea
                  value={formData.LYDO}
                  onChange={(e) => setFormData({ ...formData, LYDO: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Lý do tạm vắng"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tạo
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTamVang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa tạm vắng</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nơi tạm trú</label>
                <input
                  type="text"
                  value={formData.NOITAMTRU}
                  onChange={(e) => setFormData({ ...formData, NOITAMTRU: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={formData.TUNGAY}
                  onChange={(e) => setFormData({ ...formData, TUNGAY: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={formData.DENNGAY}
                  onChange={(e) => setFormData({ ...formData, DENNGAY: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lý do</label>
                <textarea
                  value={formData.LYDO}
                  onChange={(e) => setFormData({ ...formData, LYDO: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TamVangManagement;
