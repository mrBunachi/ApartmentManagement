import { useState, useEffect } from 'react';
import residencyHistoryService from '../../api/residencyHistory.service';
import type { ResidencyHistory } from '../../api/residencyHistory.service';
import residentService from '../../api/resident.service';
import type { Resident } from '../../api/resident.service';
import householdService from '../../api/household.service';
import type { Household } from '../../api/household.service';
import { toast } from 'react-hot-toast';

const ResidencyHistoryManagement = () => {
  const [histories, setHistories] = useState<ResidencyHistory[]>([]);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [allHouseholds, setAllHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [filterResidentId, setFilterResidentId] = useState<number | ''>('');
  const [filterHouseholdId, setFilterHouseholdId] = useState<number | ''>('');
  const [filterRoomCode, setFilterRoomCode] = useState(''); // Thêm filter theo mã phòng
  const [filterChangeType, setFilterChangeType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<ResidencyHistory | null>(null);

  useEffect(() => {
    fetchAllResidents();
    fetchAllHouseholds();
  }, []);

  useEffect(() => {
    fetchHistories();
  }, [filterResidentId, filterHouseholdId, filterRoomCode, filterChangeType, currentPage]);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (filterResidentId) params.MANHANKHAU = filterResidentId;
      if (filterHouseholdId) params.MAHOKHAU = filterHouseholdId;
      if (filterRoomCode) params.MAPHONG = filterRoomCode;
      if (filterChangeType) params.LOAITHAYDOI = filterChangeType;

      const response = await residencyHistoryService.getAll(params);
      setHistories(response.data?.hisData || []);
      setTotalCount(response.data?.countHisData || 0);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải lịch sử cư trú');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResidents = async () => {
    try {
      const response = await residentService.getAll({ page: 1, limit: 10000 });
      setAllResidents(response.residents.residents || []);
    } catch (error: any) {
      console.error('Lỗi tải danh sách nhân khẩu:', error);
    }
  };

  const fetchAllHouseholds = async () => {
    try {
      const response = await householdService.getAll({ page: 1, limit: 10000 });
      setAllHouseholds(response.apartments.apartments || []);
    } catch (error: any) {
      console.error('Lỗi tải danh sách hộ khẩu:', error);
    }
  };

  const handleReset = () => {
    setFilterResidentId('');
    setFilterHouseholdId('');
    setFilterRoomCode('');
    setFilterChangeType('');
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChangeTypeLabel = (type: string | null | undefined) => {
    const labels: Record<string, string> = {
      'XOA_HO_KHAU': 'Xóa hộ khẩu',
      'CHUYEN_DI': 'Chuyển đi',
      'TAO_HO_KHAU': 'Tạo hộ khẩu',
    };
    return labels[type || ''] || type || '-';
  };

  const getChangeTypeBadgeColor = (type: string | null | undefined) => {
    const colors: Record<string, string> = {
      'XOA_HO_KHAU': 'bg-red-100 text-red-800',
      'CHUYEN_DI': 'bg-blue-100 text-blue-800',
      'TACH_KHAU': 'bg-yellow-100 text-yellow-800',
      'TAO_HO_KHAU': 'bg-green-100 text-green',
    };
    return colors[type || ''] || 'bg-gray-100 text-gray-800';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Lịch sử Cư trú</h1>
        <p className="text-gray-600">Theo dõi lịch sử di chuyển và thay đổi của nhân khẩu</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã phòng</label>
            <input
              type="text"
              value={filterRoomCode}
              onChange={(e) => {
                setFilterRoomCode(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Ví dụ: A101"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nhân khẩu</label>
            <select
              value={filterResidentId}
              onChange={(e) => {
                setFilterResidentId(e.target.value ? Number(e.target.value) : '');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Tất cả --</option>
              {allResidents.map((resident) => (
                <option key={resident.MANHANKHAU} value={resident.MANHANKHAU}>
                  {resident.HOTEN} - {resident.SOCANCUOC}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hộ khẩu</label>
            <select
              value={filterHouseholdId}
              onChange={(e) => {
                setFilterHouseholdId(e.target.value ? Number(e.target.value) : '');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Tất cả --</option>
              {allHouseholds.map((household) => (
                <option key={household.MAHOKHAU} value={household.MAHOKHAU}>
                  {household.MAPHONG} - {household.THONGTINCHUHO?.HOTEN || 'Chưa có chủ hộ'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại thay đổi</label>
            <select
              value={filterChangeType}
              onChange={(e) => {
                setFilterChangeType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Tất cả --</option>
              <option value="TAO_HO_KHAU">Tạo hộ khẩu</option>
              <option value="XOA_HO_KHAU">Xóa hộ khẩu</option>
              <option value="CHUYEN_DI">Chuyển đi</option>
              <option value="TACH_KHAU">Tách khẩu</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng số bản ghi</p>
          <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Xóa hộ khẩu</p>
          <p className="text-2xl font-bold text-red-600">
            {histories.filter(h => h.LOAITHAYDOI === 'XOA_HO_KHAU').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Chuyển đi</p>
          <p className="text-2xl font-bold text-blue-600">
            {histories.filter(h => h.LOAITHAYDOI === 'CHUYEN_DI').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tách khẩu</p>
          <p className="text-2xl font-bold text-yellow-600">
            {histories.filter(h => h.LOAITHAYDOI === 'TACH_KHAU').length}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hộ khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quan hệ với chủ hộ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại thay đổi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày thực hiện</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {histories.map((history) => (
                <tr key={history.ID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{history.ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold text-blue-600">{history.MAPHONG || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {history.NHANKHAU ? (
                      <div>
                        <div className="font-medium">{history.NHANKHAU.HOTEN}</div>
                        <div className="text-gray-500 text-xs">{history.NHANKHAU.SOCANCUOC}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">ID: {history.MANHANKHAU}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {history.HOKHAU ? (
                      <div>
                        <div className="font-medium">Phòng {history.HOKHAU.MAPHONG}</div>
                        <div className="text-gray-500 text-xs">{history.HOKHAU.LOAICANHO}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">{history.MAHOKHAU || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {history.CHUCVU_CU || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeBadgeColor(history.LOAITHAYDOI)}`}>
                      {getChangeTypeLabel(history.LOAITHAYDOI)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-gray-900">{formatDate(history.NGAYKETTHUC)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="max-w-xs truncate" title={history.GHI_CHU || ''}>
                      {history.GHI_CHU || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedHistory(history);
                        setShowDetailModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {histories.length === 0 && (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu lịch sử</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Chi tiết Lịch sử Cư trú</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">ID Lịch sử</label>
                  <p className="text-lg">{selectedHistory.ID}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Loại thay đổi</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getChangeTypeBadgeColor(selectedHistory.LOAITHAYDOI)}`}>
                    {getChangeTypeLabel(selectedHistory.LOAITHAYDOI)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nhân khẩu</label>
                <div className="bg-gray-50 p-3 rounded">
                  {selectedHistory.NHANKHAU ? (
                    <div>
                      <p className="font-medium">{selectedHistory.NHANKHAU.HOTEN}</p>
                      <p className="text-sm text-gray-600">CCCD: {selectedHistory.NHANKHAU.SOCANCUOC}</p>
                      <p className="text-sm text-gray-600">Ngày sinh: {selectedHistory.NHANKHAU.NGAYSINH || '-'}</p>
                    </div>
                  ) : (
                    <p>ID: {selectedHistory.MANHANKHAU}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Hộ khẩu</label>
                <div className="bg-gray-50 p-3 rounded">
                  {selectedHistory.HOKHAU ? (
                    <div>
                      <p className="font-medium">Phòng {selectedHistory.HOKHAU.MAPHONG}</p>
                      <p className="text-sm text-gray-600">Loại: {selectedHistory.HOKHAU.LOAICANHO}</p>
                      <p className="text-sm text-gray-600">Địa chỉ: {selectedHistory.HOKHAU.DIACHI || '-'}</p>
                    </div>
                  ) : (
                    <p>ID: {selectedHistory.MAHOKHAU || '-'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Chức vụ cũ</label>
                  <p className="text-lg">{selectedHistory.CHUCVU_CU || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                  <p>{formatDate(selectedHistory.NGAYBATDAU)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Ngày kết thúc</label>
                  <p>{formatDate(selectedHistory.NGAYKETTHUC)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Ghi chú</label>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{selectedHistory.GHI_CHU || 'Không có ghi chú'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedHistory(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidencyHistoryManagement;
