import { useState, useEffect } from 'react';
import tamTruService from '../../api/tamTru.service';
import residentService from '../../api/resident.service';
import type { TamTru, CreateTamTruRequest } from '../../api/tamTru.service';
import type { Resident } from '../../api/resident.service';
import { toast } from 'react-hot-toast';

const TamTruManagement = () => {
  const [tamTrus, setTamTrus] = useState<TamTru[]>([]);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTamTru, setSelectedTamTru] = useState<TamTru | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateTamTruRequest>({
    MANHANKHAU: 0,
    TUNGAY: '',
    DENNGAY: '',
    LYDO: '',
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchTamTrus();
    fetchAllResidents();
  }, [page]);

  const fetchTamTrus = async () => {
    try {
      setLoading(true);
      const response = await tamTruService.getAll({ page, limit });
      setTamTrus(response.data.tamTrus || []);
      setTotalPages(Math.ceil(response.data.count / limit));
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách tạm trú');
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

  const openEditModal = (tamTru: TamTru) => {
    setSelectedTamTru(tamTru);
    setFormData({
      MANHANKHAU: tamTru.MANHANKHAU,
      TUNGAY: tamTru.TUNGAY ? new Date(tamTru.TUNGAY).toISOString().split('T')[0] : '',
      DENNGAY: tamTru.DENNGAY ? new Date(tamTru.DENNGAY).toISOString().split('T')[0] : '',
      LYDO: tamTru.LYDO || '',
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    try {
      if (!formData.MANHANKHAU) {
        toast.error('Vui lòng chọn nhân khẩu');
        return;
      }

      await tamTruService.create(formData);
      toast.success('Đăng ký tạm trú thành công');
      setShowCreateModal(false);
      resetForm();
      fetchTamTrus();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đăng ký tạm trú');
    }
  };

  const handleUpdate = async () => {
    if (!selectedTamTru) return;

    try {
      await tamTruService.update(selectedTamTru.MADANGKYTAMTRU, formData);
      toast.success('Cập nhật thông tin tạm trú thành công');
      setShowEditModal(false);
      resetForm();
      fetchTamTrus();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật tạm trú');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đăng ký tạm trú này?')) return;

    try {
      await tamTruService.delete(id);
      toast.success('Xóa đăng ký tạm trú thành công');
      fetchTamTrus();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa tạm trú');
    }
  };

  const resetForm = () => {
    setFormData({
      MANHANKHAU: 0,
      TUNGAY: '',
      DENNGAY: '',
      LYDO: '',
    });
    setSelectedTamTru(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Tạm trú</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Đăng ký tạm trú mới
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tamTrus.map((tamTru) => (
                <tr key={tamTru.MADANGKYTAMTRU} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{tamTru.MADANGKYTAMTRU}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tamTru.NHANKHAU ? (
                      <div>
                        <div className="font-medium">{tamTru.NHANKHAU.HOTEN}</div>
                        <div className="text-gray-500 text-xs">{tamTru.NHANKHAU.SOCANCUOC}</div>
                      </div>
                    ) : (
                      tamTru.MANHANKHAU
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(tamTru.TUNGAY)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(tamTru.DENNGAY)}</td>
                  <td className="px-6 py-4 text-sm">{tamTru.LYDO || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => openEditModal(tamTru)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(tamTru.MADANGKYTAMTRU)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tamTrus.length === 0 && (
            <div className="text-center py-8 text-gray-500">Chưa có đăng ký tạm trú nào</div>
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
            <h2 className="text-2xl font-bold mb-4">Đăng ký tạm trú mới</h2>
            
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
                  placeholder="Lý do tạm trú"
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
      {showEditModal && selectedTamTru && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa tạm trú</h2>
            
            <div className="space-y-4">
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

export default TamTruManagement;
