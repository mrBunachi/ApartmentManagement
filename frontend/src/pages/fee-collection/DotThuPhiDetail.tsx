import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import feeListService from '../../api/feeList.service';
import dotThuPhiService from '../../api/dotThuPhi.service';
import type { FeeListItem, DongGopItem } from '../../api/feeList.service';
import type { DotThuPhi } from '../../api/dotThuPhi.service';
import { toast } from 'react-hot-toast';

const DotThuPhiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [dotThuPhi, setDotThuPhi] = useState<DotThuPhi | null>(null);
  const [feeList, setFeeList] = useState<FeeListItem[]>([]);
  const [dongGopList, setDongGopList] = useState<DongGopItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
    totalAmount: 0,
    paidAmount: 0,
  });

  // Filter
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  
  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<FeeListItem | null>(null);
  const [paymentData, setPaymentData] = useState({
    SOTIENDADONG: 0,
    HINHTHUC: 'Tiền mặt',
    GHICHU: '',
  });

  useEffect(() => {
    if (id) {
      fetchDotThuPhi();
    }
  }, [id]);

  const fetchDotThuPhi = async () => {
    try {
      setLoading(true);
      const response = await dotThuPhiService.getById(parseInt(id!));
      const dotThu = response.dotThuPhi.dotThuPhi;
      setDotThuPhi(dotThu);

      if (dotThu.BATBUOC) {
        // Đợt bắt buộc - fetch fee list
        await fetchFeeList();
      } else {
        // Đợt tự nguyện - fetch đóng góp
        await fetchDongGop();
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải thông tin đợt thu');
      navigate('/dot-thu-phi');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeList = async () => {
    try {
      const response = await feeListService.getFeeListByDotThu(parseInt(id!));
      const data = Array.isArray(response) ? response : (response.data || []);
      setFeeList(data);
      calculateStats(data);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách hóa đơn');
    }
  };

  const fetchDongGop = async () => {
    try {
      const response = await feeListService.getDongGopByDotThu({
        MADOTTHU: parseInt(id!),
        limit: 1000,
      });
      setDongGopList(response.dongGops || []);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách đóng góp');
    }
  };

  const calculateStats = (data: FeeListItem[]) => {
    const total = data.length;
    const paid = data.filter(item => item.TRANGTHAI === true).length;
    const unpaid = total - paid;

    const totalAmount = data.reduce((sum, item) => {
      const amount = 
        (parseFloat(String(item.TIENNHA || 0))) +
        (parseFloat(String(item.TIENDICHVU || 0))) +
        (parseFloat(String(item.TIENXEMAY || 0))) +
        (parseFloat(String(item.TIENOTO || 0))) +
        (parseFloat(String(item.TIENDIEN || 0))) +
        (parseFloat(String(item.TIENNUOC || 0))) +
        (parseFloat(String(item.TIENINTERNET || 0)));
      return sum + amount;
    }, 0);

    const paidAmount = data.reduce((sum, item) => {
      return sum + (parseFloat(String(item.SOTIENDADONG || 0)));
    }, 0);

    setStats({ total, paid, unpaid, totalAmount, paidAmount });
  };

  const openPaymentModal = (bill: FeeListItem) => {
    setSelectedBill(bill);
    const totalBill = 
      (parseFloat(String(bill.TIENNHA || 0))) +
      (parseFloat(String(bill.TIENDICHVU || 0))) +
      (parseFloat(String(bill.TIENXEMAY || 0))) +
      (parseFloat(String(bill.TIENOTO || 0))) +
      (parseFloat(String(bill.TIENDIEN || 0))) +
      (parseFloat(String(bill.TIENNUOC || 0))) +
      (parseFloat(String(bill.TIENINTERNET || 0)));
    
    setPaymentData({
      SOTIENDADONG: totalBill,
      HINHTHUC: 'Tiền mặt',
      GHICHU: '',
    });
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedBill) return;

    try {
      await feeListService.updatePayment(
        selectedBill.MADOTTHU,
        selectedBill.MAHOKHAU,
        paymentData
      );
      toast.success('Cập nhật thanh toán thành công');
      setShowPaymentModal(false);
      fetchFeeList();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật thanh toán');
    }
  };

  const filteredFeeList = feeList.filter(item => {
    if (filterStatus === 'paid') return item.TRANGTHAI === true;
    if (filterStatus === 'unpaid') return item.TRANGTHAI === false;
    return true;
  });

  const formatCurrency = (amount: number | string | undefined) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(parseFloat(String(amount)));
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  if (!dotThuPhi) {
    return <div className="p-6 text-center">Không tìm thấy đợt thu phí</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dot-thu-phi')}
          className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2"
        >
          ← Quay lại
        </button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{dotThuPhi.TEN}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Ngày tạo: {dotThuPhi.NGAYTAO ? new Date(dotThuPhi.NGAYTAO).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
              {dotThuPhi.MOTA && (
                <p className="text-sm text-gray-600 mt-2">{dotThuPhi.MOTA}</p>
              )}
            </div>
            <div>
              {dotThuPhi.BATBUOC ? (
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                  Bắt buộc
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Tự nguyện
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Chỉ hiển thị cho đợt bắt buộc */}
      {dotThuPhi.BATBUOC && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Tổng số hộ</div>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Đã đóng</div>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Chưa đóng</div>
            <div className="text-2xl font-bold text-red-600">{stats.unpaid}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Tổng tiền</div>
            <div className="text-xl font-bold text-gray-800">
              {formatCurrency(stats.totalAmount)} đ
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Đã thu</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(stats.paidAmount)} đ
            </div>
          </div>
        </div>
      )}

      {/* Content - Phí bắt buộc */}
      {dotThuPhi.BATBUOC ? (
        <div className="bg-white rounded-lg shadow">
          {/* Filter */}
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tất cả ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'paid'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Đã đóng ({stats.paid})
              </button>
              <button
                onClick={() => setFilterStatus('unpaid')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'unpaid'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Chưa đóng ({stats.unpaid})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ hộ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tiền nhà</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Điện</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nước</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeeList.map((item) => {
                  const total = 
                    (parseFloat(String(item.TIENNHA || 0))) +
                    (parseFloat(String(item.TIENDICHVU || 0))) +
                    (parseFloat(String(item.TIENXEMAY || 0))) +
                    (parseFloat(String(item.TIENOTO || 0))) +
                    (parseFloat(String(item.TIENDIEN || 0))) +
                    (parseFloat(String(item.TIENNUOC || 0))) +
                    (parseFloat(String(item.TIENINTERNET || 0)));

                  return (
                    <tr key={item.MAHOKHAU} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.HOKHAU?.MAPHONG || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.HOKHAU?.THONGTINCHUHO?.HOTEN || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(item.TIENNHA)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(item.TIENDICHVU)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(item.TIENDIEN)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(item.TIENNUOC)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.TRANGTHAI ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Đã đóng
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Chưa đóng
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!item.TRANGTHAI && (
                          <button
                            onClick={() => openPaymentModal(item)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Thu tiền
                          </button>
                        )}
                        {item.TRANGTHAI && item.NGAYDONG && (
                          <span className="text-xs text-gray-500">
                            {new Date(item.NGAYDONG).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Content - Phí tự nguyện */
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách đóng góp ({dongGopList.length} phiếu)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ hộ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại quỹ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình thức</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đóng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dongGopList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Chưa có phiếu đóng góp nào
                    </td>
                  </tr>
                ) : (
                  dongGopList.map((item) => (
                    <tr key={item.MADONGGOP} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.HOKHAU?.MAPHONG || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.HOKHAU?.THONGTINCHUHO?.HOTEN || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.LOAIPHI?.TEN || 'Đóng góp chung'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(item.SOTIENDADONG)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.HINHTHUC || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.NGAYDONG ? new Date(item.NGAYDONG).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.GHICHU || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thu tiền - {selectedBill.HOKHAU?.MAPHONG}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền thu <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentData.SOTIENDADONG}
                  onChange={(e) => setPaymentData({ ...paymentData, SOTIENDADONG: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức
                </label>
                <select
                  value={paymentData.HINHTHUC}
                  onChange={(e) => setPaymentData({ ...paymentData, HINHTHUC: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={paymentData.GHICHU}
                  onChange={(e) => setPaymentData({ ...paymentData, GHICHU: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePayment}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
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

export default DotThuPhiDetail;
