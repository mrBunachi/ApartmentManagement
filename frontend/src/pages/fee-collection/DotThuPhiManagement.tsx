import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dotThuPhiService from '../../api/dotThuPhi.service';
import householdService from '../../api/household.service';
import type { DotThuPhi, CreateDotThuPhiRequest, BillItemInput } from '../../api/dotThuPhi.service';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

// Hàm format date đáng tin cậy hơn toLocaleDateString
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '-';
  }
};

const DotThuPhiManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dotThuPhis, setDotThuPhis] = useState<DotThuPhi[]>([]);
  const [allHouseholds, setAllHouseholds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBillInputModal, setShowBillInputModal] = useState(false);
  const [selectedDotThu, setSelectedDotThu] = useState<DotThuPhi | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateDotThuPhiRequest>({
    TEN: '',
    BATBUOC: true,
    MOTA: '',
    NGUOIQUANLYId: user?.id || 0,
  });

  // Bill input state - mảng chứa chỉ số điện nước của tất cả hộ
  const [billsData, setBillsData] = useState<BillItemInput[]>([]);
  
  // Đơn giá chung cho tất cả hộ
  const [dongGiaDienChung, setDongGiaDienChung] = useState<number>(3500);
  const [dongGiaNuocChung, setDongGiaNuocChung] = useState<number>(20000);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Filters
  const [filterBatBuoc, setFilterBatBuoc] = useState<string>('all');

  useEffect(() => {
    fetchDotThuPhis();
  }, [page, filterBatBuoc]);

  const fetchDotThuPhis = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (filterBatBuoc !== 'all') {
        params.BATBUOC = filterBatBuoc === 'true';
      }
      const response = await dotThuPhiService.getAll(params);
      setDotThuPhis(response.dotThuPhi.dotThuPhis || []);
      setTotalPages(Math.ceil(response.dotThuPhi.count / limit));
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách đợt thu phí');
    } finally {
      setLoading(false);
    }
  };

  // Unused function - commented out to fix build
  // const fetchAllHouseholds = async () => {
  //   try {
  //     const response = await householdService.getAll({ ACTIVATE: true, limit: 10000 });
  //     setAllHouseholds(response.apartments.apartments || []);
  //   } catch (error: any) {
  //     toast.error(error.message || 'Lỗi khi tải danh sách hộ khẩu');
  //   }
  // };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (dotThu: DotThuPhi) => {
    setSelectedDotThu(dotThu);
    setFormData({
      TEN: dotThu.TEN,
      BATBUOC: dotThu.BATBUOC,
      NGAYBATDAU: dotThu.NGAYBATDAU ? dotThu.NGAYBATDAU.split('T')[0] : '',
      NGAYKETTHUC: dotThu.NGAYKETTHUC ? dotThu.NGAYKETTHUC.split('T')[0] : '',
      MOTA: dotThu.MOTA || '',
      NGUOIQUANLYId: dotThu.NGUOIQUANLYId,
    });
    setShowEditModal(true);
  };

  const openBillInputModal = async (dotThu: DotThuPhi) => {
    setSelectedDotThu(dotThu);
    setLoading(true);
    
    try {
      // Fetch households first
      const response = await householdService.getAll({ ACTIVATE: true, limit: 10000 });
      const households = response.apartments.apartments || [];
      setAllHouseholds(households);
      
      // Initialize bills with default values
      const initialBills = households.map(hk => ({
        MAHOKHAU: hk.MAHOKHAU,
        SODIEN: 0,
        SONUOC: 0,
        DONGIADIEN: dongGiaDienChung,
        DONGIANUOC: dongGiaNuocChung,
        TIENINTERNET: 0,
      }));
      setBillsData(initialBills);
      setShowBillInputModal(true);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!formData.TEN.trim()) {
        toast.error('Vui lòng nhập tên đợt thu');
        return;
      }

      // Convert date strings to ISO DateTime
      const dataToSubmit: any = {
        TEN: formData.TEN,
        BATBUOC: formData.BATBUOC,
        MOTA: formData.MOTA,
        NGUOIQUANLYId: user?.id || 0,
      };

      // Only add dates if they are provided
      if (formData.NGAYBATDAU) {
        dataToSubmit.NGAYBATDAU = new Date(formData.NGAYBATDAU).toISOString();
      }
      if (formData.NGAYKETTHUC) {
        dataToSubmit.NGAYKETTHUC = new Date(formData.NGAYKETTHUC).toISOString();
      }

      const newDotThu = await dotThuPhiService.create(dataToSubmit);
      
      toast.success('Tạo đợt thu phí thành công');
      setShowCreateModal(false);
      resetForm();
      fetchDotThuPhis();

      // Nếu là đợt bắt buộc, mở form nhập chỉ số
      if (formData.BATBUOC) {
        setTimeout(() => {
          openBillInputModal(newDotThu.dotThuPhi);
        }, 500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo đợt thu phí');
    }
  };

  const handleUpdate = async () => {
    if (!selectedDotThu) return;

    try {
      // Convert date strings to ISO DateTime
      const dataToSubmit: any = {
        TEN: formData.TEN,
        MOTA: formData.MOTA,
      };

      // Only add dates if they are provided
      if (formData.NGAYBATDAU) {
        dataToSubmit.NGAYBATDAU = new Date(formData.NGAYBATDAU).toISOString();
      }
      if (formData.NGAYKETTHUC) {
        dataToSubmit.NGAYKETTHUC = new Date(formData.NGAYKETTHUC).toISOString();
      }

      await dotThuPhiService.update(selectedDotThu.MADOTTHU, dataToSubmit);
      toast.success('Cập nhật đợt thu phí thành công');
      setShowEditModal(false);
      resetForm();
      fetchDotThuPhis();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật đợt thu phí');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa đợt thu phí? Tất cả hóa đơn trong đợt sẽ bị xóa.')) return;

    try {
      await dotThuPhiService.delete(id);
      toast.success('Xóa đợt thu phí thành công');
      fetchDotThuPhis();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa đợt thu phí');
    }
  };

  const handleSubmitBills = async () => {
    if (!selectedDotThu) return;

    // Validate - ít nhất 1 hộ phải có chỉ số > 0
    const validBills = billsData.filter(b => b.SODIEN > 0 || b.SONUOC > 0);
    if (validBills.length === 0) {
      toast.error('Vui lòng nhập ít nhất 1 hộ có chỉ số điện hoặc nước');
      return;
    }

    try {
      setLoading(true);
      const response = await dotThuPhiService.createBulkBills(
        selectedDotThu.MADOTTHU,
        validBills
      );

      toast.success(
        `Tạo hóa đơn thành công: ${response.summary.success}/${response.summary.total} hộ`
      );

      if (response.summary.failed > 0) {
        console.warn('Có lỗi khi tạo hóa đơn:', response.details.errors);
        toast.error(`Có ${response.summary.failed} hộ thất bại. Xem console để biết chi tiết.`);
      }

      setShowBillInputModal(false);
      setBillsData([]);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo hóa đơn hàng loạt');
    } finally {
      setLoading(false);
    }
  };

  const updateBillItem = (maHoKhau: number, field: keyof BillItemInput, value: number) => {
    setBillsData(prev =>
      prev.map(bill =>
        bill.MAHOKHAU === maHoKhau ? { ...bill, [field]: value } : bill
      )
    );
  };

  const updateAllDongGiaDien = (value: number) => {
    setDongGiaDienChung(value);
    setBillsData(prev => prev.map(bill => ({ ...bill, DONGIADIEN: value })));
  };

  const updateAllDongGiaNuoc = (value: number) => {
    setDongGiaNuocChung(value);
    setBillsData(prev => prev.map(bill => ({ ...bill, DONGIANUOC: value })));
  };

  const resetForm = () => {
    setFormData({
      TEN: '',
      BATBUOC: true,
      MOTA: '',
      NGUOIQUANLYId: user?.id || 0,
    });
    setSelectedDotThu(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đợt Thu Phí</h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <span>+</span> Tạo đợt thu mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Loại đợt thu:</label>
          <select
            value={filterBatBuoc}
            onChange={(e) => {
              setFilterBatBuoc(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Tất cả</option>
            <option value="true">Bắt buộc (Điện/Nước)</option>
            <option value="false">Tự nguyện (Đóng góp)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đợt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên đợt thu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : dotThuPhis.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Chưa có đợt thu phí nào
                </td>
              </tr>
            ) : (
              dotThuPhis.map((dotThu) => (
                <tr key={dotThu.MADOTTHU} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{dotThu.MADOTTHU}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{dotThu.TEN}</div>
                    {dotThu.MOTA && (
                      <div className="text-xs text-gray-500 mt-1">{dotThu.MOTA}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {dotThu.BATBUOC ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Bắt buộc
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Tự nguyện
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dotThu.NGAYBATDAU && dotThu.NGAYKETTHUC ? (
                      <div>
                        <div className="text-xs">
                          🟢 {formatDate(dotThu.NGAYBATDAU)}
                        </div>
                        <div className="text-xs">
                          🔴 {formatDate(dotThu.NGAYKETTHUC)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Không giới hạn</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dotThu.NGUOIQUANLY?.HOTEN || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dot-thu-phi/${dotThu.MADOTTHU}`)}
                        className="text-green-600 hover:text-green-800"
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      {dotThu.BATBUOC && (
                        <button
                          onClick={() => openBillInputModal(dotThu)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Nhập chỉ số điện nước"
                        >
                          📊
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(dotThu)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(dotThu.MADOTTHU)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Tạo đợt thu phí mới</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đợt thu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TEN}
                  onChange={(e) => setFormData({ ...formData, TEN: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="VD: Thu phí tháng 1/2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại đợt thu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.BATBUOC ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, BATBUOC: e.target.value === 'true' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="true">Bắt buộc (Điện/Nước/Dịch vụ)</option>
                  <option value="false">Tự nguyện (Đóng góp/Quỹ)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.BATBUOC 
                    // ? '💡 Sau khi tạo sẽ mở form nhập chỉ số điện nước cho tất cả hộ'
                    // : '💰 Dùng cho các khoản đóng góp quỹ, ủng hộ tự nguyện'
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.NGAYBATDAU || ''}
                    onChange={(e) => setFormData({ ...formData, NGAYBATDAU: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">Ngày bắt đầu cho phép đóng</p> */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.NGAYKETTHUC || ''}
                    onChange={(e) => setFormData({ ...formData, NGAYKETTHUC: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">Hạn chót đóng phí</p> */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.MOTA}
                  onChange={(e) => setFormData({ ...formData, MOTA: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Mô tả về đợt thu này..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Tạo đợt thu
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDotThu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa đợt thu phí</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đợt thu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TEN}
                  onChange={(e) => setFormData({ ...formData, TEN: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.NGAYBATDAU || ''}
                    onChange={(e) => setFormData({ ...formData, NGAYBATDAU: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.NGAYKETTHUC || ''}
                    onChange={(e) => setFormData({ ...formData, NGAYKETTHUC: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.MOTA}
                  onChange={(e) => setFormData({ ...formData, MOTA: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Không thể thay đổi loại đợt thu sau khi tạo
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Input Modal - Nhập chỉ số điện nước hàng loạt */}
      {showBillInputModal && selectedDotThu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Nhập chỉ số điện nước - {selectedDotThu.TEN}
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              {/* <p className="text-sm text-blue-800">
                 Nhập chỉ số điện và nước cho từng hộ. Chỉ những hộ có ít nhất 1 chỉ số &gt; 0 sẽ được tạo hóa đơn.
              </p> */}
            </div>

            {/* Đơn giá chung */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Đơn giá chung cho tất cả hộ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn giá điện (VNĐ/kWh)
                  </label>
                  <input
                    type="number"
                    value={dongGiaDienChung}
                    onChange={(e) => updateAllDongGiaDien(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn giá nước (VNĐ/m³)
                  </label>
                  <input
                    type="number"
                    value={dongGiaNuocChung}
                    onChange={(e) => updateAllDongGiaNuoc(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Table nhập chỉ số */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Phòng</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Chủ hộ</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Số điện (kWh)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Số nước (m³)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Internet (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billsData.map((bill) => {
                    const household = allHouseholds.find(h => h.MAHOKHAU === bill.MAHOKHAU);
                    return (
                      <tr key={bill.MAHOKHAU} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium">{household?.MAPHONG || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm">{household?.THONGTINCHUHO?.HOTEN || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={bill.SODIEN}
                            onChange={(e) => updateBillItem(bill.MAHOKHAU, 'SODIEN', parseFloat(e.target.value) || 0)}
                            className="w-28 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            step="0.1"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={bill.SONUOC}
                            onChange={(e) => updateBillItem(bill.MAHOKHAU, 'SONUOC', parseFloat(e.target.value) || 0)}
                            className="w-28 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            step="0.1"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={bill.TIENINTERNET || 0}
                            onChange={(e) => updateBillItem(bill.MAHOKHAU, 'TIENINTERNET', parseFloat(e.target.value) || 0)}
                            className="w-28 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitBills}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Tạo hóa đơn'}
              </button>
              <button
                onClick={() => {
                  setShowBillInputModal(false);
                  setBillsData([]);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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

export default DotThuPhiManagement;
