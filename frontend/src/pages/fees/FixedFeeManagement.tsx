import { useEffect, useState } from 'react';
import { fixedFeeService } from '../../api/fixedFee.service';
import type { FixedFee, CreateFixedFeeRequest, UpdateFixedFeeRequest } from '../../api/fixedFee.service';

export default function FixedFeeManagement() {
  const [fees, setFees] = useState<FixedFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedFee, setSelectedFee] = useState<FixedFee | null>(null);

  const [formData, setFormData] = useState<CreateFixedFeeRequest>({
    LOAICANHO: '',
    GIATIENCANHO: 0,
    PHIQLCHUNGCU: 0,
    PHIXEMAY: 0,
    PHIXEOTO: 0,
  });

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fixedFeeService.getAll();
      setFees(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách phí cố định');
      console.error('❌ Load fixed fees error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedFee(null);
    setFormData({
      LOAICANHO: '',
      GIATIENCANHO: 0,
      PHIQLCHUNGCU: 0,
      PHIXEMAY: 0,
      PHIXEOTO: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (fee: FixedFee) => {
    setModalMode('edit');
    setSelectedFee(fee);
    setFormData({
      LOAICANHO: fee.LOAICANHO,
      GIATIENCANHO: fee.GIATIENCANHO || 0,
      PHIQLCHUNGCU: fee.PHIQLCHUNGCU || 0,
      PHIXEMAY: fee.PHIXEMAY || 0,
      PHIXEOTO: fee.PHIXEOTO || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (modalMode === 'create') {
        await fixedFeeService.create(formData);
      } else if (selectedFee) {
        const updateData: UpdateFixedFeeRequest = {
          GIATIENCANHO: formData.GIATIENCANHO,
          PHIQLCHUNGCU: formData.PHIQLCHUNGCU,
          PHIXEMAY: formData.PHIXEMAY,
          PHIXEOTO: formData.PHIXEOTO,
        };
        await fixedFeeService.update(selectedFee.LOAICANHO, updateData);
      }

      setShowModal(false);
      loadFees();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra');
      console.error('❌ Submit error:', err);
    }
  };

  const handleDelete = async (fee: FixedFee) => {
    if (!window.confirm(`Bạn có chắc muốn xóa loại căn hộ "${fee.LOAICANHO}"?\n\nLưu ý: Không thể xóa nếu đã có hộ khẩu sử dụng loại này.`)) return;

    try {
      await fixedFeeService.delete(fee.LOAICANHO);
      loadFees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa loại căn hộ');
      console.error('❌ Delete error:', err);
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

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
          <h3 className="text-lg font-medium text-gray-900">Quản lý Phí Cố Định</h3>
          <p className="text-sm text-gray-500">Cấu hình giá phí theo loại căn hộ</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <span> </span> Thêm Loại Căn Hộ
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại căn hộ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giá căn hộ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Phí QL chung cư</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Phí xe máy</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Phí ô tô</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Chưa có loại căn hộ nào. Nhấn "Thêm Loại Căn Hộ" để tạo mới.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.LOAICANHO} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-sm font-bold bg-indigo-100 text-indigo-800 rounded-full">
                        {fee.LOAICANHO}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                      {formatCurrency(fee.GIATIENCANHO)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(fee.PHIQLCHUNGCU)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(fee.PHIXEMAY)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(fee.PHIXEOTO)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(fee)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(fee)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold mb-4">
              {modalMode === 'create' ? 'Thêm Loại Căn Hộ Mới' : `Chỉnh Sửa Giá - Loại ${selectedFee?.LOAICANHO}`}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại căn hộ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'edit'}
                  value={formData.LOAICANHO}
                  onChange={(e) => setFormData({ ...formData, LOAICANHO: e.target.value.toUpperCase() })}
                  placeholder="VD: A, B, C1, C2, PENTHOUSE"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                {modalMode === 'edit' && (
                  <p className="mt-1 text-xs text-gray-500">Không thể thay đổi mã loại căn hộ</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá căn hộ (₫)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.GIATIENCANHO}
                    onChange={(e) => setFormData({ ...formData, GIATIENCANHO: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phí quản lý chung cư (₫/tháng)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.PHIQLCHUNGCU}
                    onChange={(e) => setFormData({ ...formData, PHIQLCHUNGCU: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phí xe máy (₫/xe/tháng)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.PHIXEMAY}
                    onChange={(e) => setFormData({ ...formData, PHIXEMAY: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phí ô tô (₫/xe/tháng)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.PHIXEOTO}
                    onChange={(e) => setFormData({ ...formData, PHIXEOTO: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2"> Phí gửi xe sẽ được tính tự động</h4>
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
