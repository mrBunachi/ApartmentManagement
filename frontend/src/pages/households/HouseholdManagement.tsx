import { useState, useEffect } from 'react';
import householdService from '../../api/household.service';
import type { Household, CreateHouseholdRequest, UpdateHouseholdRequest } from '../../api/household.service';
import fixedFeeService from '../../api/fixedFee.service';
import type { FixedFee } from '../../api/fixedFee.service';
import residentService from '../../api/resident.service';
import type { Resident } from '../../api/resident.service';
import { toast } from 'react-hot-toast';

type SortField = 'HOTEN' | 'SOCANCUOC';
type SortOrder = 'asc' | 'desc';

const HouseholdManagement = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [apartmentTypes, setApartmentTypes] = useState<FixedFee[]>([]);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSelectHeadModal, setShowSelectHeadModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateHouseholdRequest>({
    MAPHONG: '',
    LOAICANHO: '',
    XEMAY: 0,
    OTO: 0,
  });
  
  // Chủ hộ selection
  const [selectedHeadId, setSelectedHeadId] = useState<number | null>(null);
  const [residentSearchTerm, setResidentSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('HOTEN');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Room history
  const [roomCodeFilter, setRoomCodeFilter] = useState('');
  const [roomHistory, setRoomHistory] = useState<Household[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Members in selected household
  const [householdMembers, setHouseholdMembers] = useState<Resident[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchHouseholds();
    fetchApartmentTypes();
    fetchAllResidents();
  }, []);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const response = await householdService.getAll({ ACTIVATE: true, include: true });
      setHouseholds(response.apartments.apartments || []);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const fetchApartmentTypes = async () => {
    try {
      const response = await fixedFeeService.getAll();
      setApartmentTypes(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải loại căn hộ');
    }
  };

  const fetchAllResidents = async () => {
    try {
      // Lấy toàn bộ nhân khẩu đang hoạt động trong chung cư (không phân trang)
      const response = await residentService.getAll({ ACTIVATE: true, page: 1, limit: 10000 });
      setAllResidents(response.residents.residents || []);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách nhân khẩu');
    }
  };

  // Handle create household
  const handleCreate = async (withHead: boolean = false) => {
    if (!formData.MAPHONG || !formData.LOAICANHO) {
      toast.error('Vui lòng nhập đầy đủ Mã phòng và Loại căn hộ');
      return;
    }

    try {
      const dataToSubmit: CreateHouseholdRequest = {
        ...formData,
        IDCHUHO: withHead && selectedHeadId ? selectedHeadId : undefined,
      };

      await householdService.create(dataToSubmit);
      toast.success('Tạo hộ khẩu thành công');
      setShowCreateModal(false);
      setShowSelectHeadModal(false);
      resetForm();
      fetchHouseholds();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo hộ khẩu');
    }
  };

  // Handle update household
  const handleUpdate = async () => {
    if (!selectedHousehold) return;

    try {
      const dataToUpdate: UpdateHouseholdRequest = {
        MAPHONG: formData.MAPHONG,
        LOAICANHO: formData.LOAICANHO,
        XEMAY: formData.XEMAY,
        OTO: formData.OTO,
      };

      await householdService.update(selectedHousehold.MAHOKHAU, dataToUpdate);
      toast.success('Cập nhật hộ khẩu thành công');
      setShowEditModal(false);
      resetForm();
      fetchHouseholds();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật hộ khẩu');
    }
  };

  // Handle delete household
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) return;

    try {
      await householdService.delete(id);
      toast.success('Xóa hộ khẩu thành công');
      fetchHouseholds();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa hộ khẩu');
    }
  };

  // Fetch room history
  const fetchRoomHistory = async () => {
    if (!roomCodeFilter.trim()) {
      toast.error('Vui lòng nhập mã phòng');
      return;
    }

    try {
      setLoadingHistory(true);
      const response = await householdService.getAll({ 
        MAPHONG: roomCodeFilter.trim(), 
        include: true 
      });
      setRoomHistory(response.apartments.apartments || []);
      
      if (response.apartments.apartments?.length === 0) {
        toast('Không tìm thấy lịch sử cho phòng này');
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải lịch sử phòng');
      setRoomHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      MAPHONG: '',
      LOAICANHO: '',
      XEMAY: 0,
      OTO: 0,
    });
    setSelectedHeadId(null);
    setSelectedHousehold(null);
    setResidentSearchTerm('');
  };

  // Open member management modal
  const openMemberModal = async (household: Household) => {
    setSelectedHousehold(household);
    setShowMemberModal(true);
    
    // Refresh all residents list with ACTIVATE filter (no pagination)
    await fetchAllResidents();
    
    // Fetch members of this household
    try {
      setLoadingMembers(true);
      const response = await residentService.getAll({ 
        ACTIVATE: true, 
        limit: 10000 
      });
      
      // Filter members by household ID
      const members = response.residents.residents.filter(
        (r) => r.MAHOKHAU === household.MAHOKHAU
      );
      setHouseholdMembers(members);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải danh sách thành viên');
      setHouseholdMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Add member to household
  const handleAddMember = async (residentId: number) => {
    if (!selectedHousehold) return;

    try {
      await residentService.update(residentId, { 
        MAHOKHAU: selectedHousehold.MAHOKHAU 
      });
      toast.success('Đã thêm thành viên vào hộ khẩu');
      
      // Refresh members list
      const response = await residentService.getAll({ 
        ACTIVATE: true, 
        limit: 10000 
      });
      const members = response.residents.residents.filter(
        (r) => r.MAHOKHAU === selectedHousehold.MAHOKHAU
      );
      setHouseholdMembers(members);
      
      fetchHouseholds();
      fetchAllResidents();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi thêm thành viên');
    }
  };

  // Remove member from household
  const handleRemoveMember = async (residentId: number) => {
    if (!selectedHousehold) return;
    
    // // Kiểm tra nếu là chủ hộ
    // if (residentId === selectedHousehold.IDCHUHO) {
    //   toast.error('Không thể xóa chủ hộ khỏi hộ khẩu. Vui lòng chuyển quyền chủ hộ trước khi xóa.');
    //   return;
    // }
    
    if (!confirm('Bạn có chắc muốn xóa thành viên khỏi hộ khẩu?')) return;

    try {
      // Gửi null thay vì undefined để xóa MAHOKHAU
      await residentService.update(residentId, { MAHOKHAU: null });
      toast.success('Đã xóa thành viên khỏi hộ khẩu');
      
      // Reload lại danh sách thành viên và available residents
      await openMemberModal(selectedHousehold);
      
      // Refresh households list
      fetchHouseholds();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa thành viên');
    }
  };

  // Set household head (for households without head)
  const handleSetHead = async (headId: number) => {
    if (!selectedHousehold) return;

    try {
      await householdService.updateHead(selectedHousehold.MAHOKHAU, headId);
      toast.success('Đã gán chủ hộ thành công');
      
      // Refresh household info
      const response = await householdService.getById(selectedHousehold.MAHOKHAU);
      if (response.apartments && response.apartments.length > 0) {
        setSelectedHousehold(response.apartments[0]);
      }
      
      fetchHouseholds();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi gán chủ hộ');
    }
  };

  // Open modals
  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (household: Household) => {
    setSelectedHousehold(household);
    setFormData({
      MAPHONG: household.MAPHONG || '',
      LOAICANHO: household.LOAICANHO || '',
      XEMAY: household.XEMAY || 0,
      OTO: household.OTO || 0,
    });
    setShowEditModal(true);
  };

  const openSelectHeadModal = () => {
    setShowSelectHeadModal(true);
  };

  // Filter and sort residents
  const filteredAndSortedResidents = allResidents
    .filter((resident) => {
      if (!residentSearchTerm) return true;
      const search = residentSearchTerm.toLowerCase();
      return (
        resident.HOTEN?.toLowerCase().includes(search) ||
        resident.SOCANCUOC?.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      let aValue = '';
      let bValue = '';

      if (sortField === 'HOTEN') {
        aValue = a.HOTEN || '';
        bValue = b.HOTEN || '';
      } else if (sortField === 'SOCANCUOC') {
        aValue = a.SOCANCUOC || '';
        bValue = b.SOCANCUOC || '';
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue, 'vi');
      } else {
        return bValue.localeCompare(aValue, 'vi');
      }
    });

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Calculate vehicle fee
  const calculateVehicleFee = (household: Household) => {
    const fee = household.PHICODINH;
    if (!fee) return 0;
    
    const xeMayFee = (household.XEMAY || 0) * (fee.PHIXEMAY || 0);
    const otoFee = (household.OTO || 0) * (fee.PHIXEOTO || 0);
    return xeMayFee + otoFee;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Hộ khẩu</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tạo hộ khẩu mới
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã HK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại CH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ hộ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe máy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ô tô</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí Xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {households.map((household) => (
                <tr key={household.MAHOKHAU} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{household.MAHOKHAU}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{household.MAPHONG}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{household.LOAICANHO}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {household.THONGTINCHUHO ? (
                      <div>
                        <div className="font-medium">{household.THONGTINCHUHO.HOTEN}</div>
                        <div className="text-gray-500 text-xs">{household.THONGTINCHUHO.SOCANCUOC}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Chưa có</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{household.XEMAY || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{household.OTO || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(calculateVehicleFee(household))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => openEditModal(household)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(household.MAHOKHAU)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {households.length === 0 && (
            <div className="text-center py-8 text-gray-500">Chưa có hộ khẩu nào</div>
          )}
        </div>
      )}

      {/* Room History Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử phòng theo mã phòng</h2>
        <p className="text-gray-600 mb-4">
          Tra cứu lịch sử các chủ hộ đã ở tại một phòng cụ thể (bao gồm cả hộ khẩu đã bị xóa)
        </p>

        {/* Search */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={roomCodeFilter}
            onChange={(e) => setRoomCodeFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRoomHistory()}
            placeholder="Nhập mã phòng (ví dụ: A101)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchRoomHistory}
            disabled={loadingHistory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loadingHistory ? 'Đang tải...' : 'Tìm kiếm'}
          </button>
        </div>

        {/* Results */}
        {roomHistory.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã HK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ hộ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại CH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày kết thúc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roomHistory.map((household) => (
                  <tr key={household.MAHOKHAU} className={household.ACTIVATE ? 'bg-green-50' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{household.MAHOKHAU}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{household.MAPHONG}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {household.THONGTINCHUHO ? (
                        <div>
                          <div className="font-medium">{household.THONGTINCHUHO.HOTEN}</div>
                          <div className="text-gray-500 text-xs">{household.THONGTINCHUHO.SOCANCUOC}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{household.LOAICANHO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {household.NGAYTAO ? new Date(household.NGAYTAO).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {household.NGAYKETTHUC ? new Date(household.NGAYKETTHUC).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {household.ACTIVATE ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          Đã kết thúc
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Tạo hộ khẩu mới</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mã Phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.MAPHONG}
                  onChange={(e) => setFormData({ ...formData, MAPHONG: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Loại Căn hộ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.LOAICANHO}
                  onChange={(e) => setFormData({ ...formData, LOAICANHO: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn loại căn hộ --</option>
                  {apartmentTypes.map((type) => (
                    <option key={type.LOAICANHO} value={type.LOAICANHO}>
                      {type.LOAICANHO} - {formatCurrency(type.GIATIENCANHO)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số Xe máy</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.XEMAY}
                    onChange={(e) => setFormData({ ...formData, XEMAY: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Số Ô tô</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.OTO}
                    onChange={(e) => setFormData({ ...formData, OTO: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Chọn chủ hộ (optional) */}
              <div>
                <label className="block text-sm font-medium mb-1">Chủ hộ (tùy chọn)</label>
                {selectedHeadId ? (
                  <div className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                    <span className="text-sm">
                      {allResidents.find(r => r.MANHANKHAU === selectedHeadId)?.HOTEN || 'Đã chọn'}
                    </span>
                    <button
                      onClick={() => setSelectedHeadId(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openSelectHeadModal}
                    className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                  >
                    + Chọn chủ hộ
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => handleCreate(!!selectedHeadId)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tạo hộ khẩu
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
      {showEditModal && selectedHousehold && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa hộ khẩu</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mã Phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.MAPHONG}
                  onChange={(e) => setFormData({ ...formData, MAPHONG: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Loại Căn hộ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.LOAICANHO}
                  onChange={(e) => setFormData({ ...formData, LOAICANHO: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn loại căn hộ --</option>
                  {apartmentTypes.map((type) => (
                    <option key={type.LOAICANHO} value={type.LOAICANHO}>
                      {type.LOAICANHO} - {formatCurrency(type.GIATIENCANHO)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số Xe máy</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.XEMAY}
                    onChange={(e) => setFormData({ ...formData, XEMAY: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Số Ô tô</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.OTO}
                    onChange={(e) => setFormData({ ...formData, OTO: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Để thay đổi chủ hộ, cần xóa hộ khẩu này và tạo hộ khẩu mới.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  openMemberModal(selectedHousehold);
                  setShowEditModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Chỉnh sửa thành viên
              </button>
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

      {/* Select Head Modal */}
      {showSelectHeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Chọn chủ hộ</h2>
            
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={residentSearchTerm}
                onChange={(e) => setResidentSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, SĐT, CCCD..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort controls */}
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => toggleSort('HOTEN')}
                className={`px-3 py-1 rounded text-sm ${
                  sortField === 'HOTEN' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Tên {sortField === 'HOTEN' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('SOCANCUOC')}
                className={`px-3 py-1 rounded text-sm ${
                  sortField === 'SOCANCUOC' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Số CCCD {sortField === 'SOCANCUOC' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Họ tên</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SĐT</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">CCCD</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Chọn</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedResidents.map((resident) => (
                    <tr
                      key={resident.MANHANKHAU}
                      className={`hover:bg-gray-50 ${selectedHeadId === resident.MANHANKHAU ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-2 text-sm">{resident.HOTEN}</td>
                      <td className="px-4 py-2 text-sm">{resident.SOCANCUOC || '-'}</td>
                      <td className="px-4 py-2 text-sm">{resident.SOCANCUOC || '-'}</td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => {
                            setSelectedHeadId(resident.MANHANKHAU);
                            setShowSelectHeadModal(false);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Chọn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAndSortedResidents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không tìm thấy nhân khẩu nào
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowSelectHeadModal(false);
                  setResidentSearchTerm('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      {showMemberModal && selectedHousehold && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4">
              Quản lý thành viên - Phòng {selectedHousehold.MAPHONG}
            </h2>

            {/* Display current head if no head */}
            {!selectedHousehold.IDCHUHO && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  ⚠️ Hộ khẩu chưa có chủ hộ. Vui lòng chọn chủ hộ từ danh sách thành viên.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
              {/* Current Members */}
              <div className="flex flex-col border rounded-lg">
                <div className="p-3 bg-gray-50 border-b font-medium">
                  Thành viên hiện tại ({householdMembers.length})
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {loadingMembers ? (
                    <div className="text-center py-8 text-gray-500">Đang tải...</div>
                  ) : householdMembers.length > 0 ? (
                    householdMembers.map((member) => (
                      <div
                        key={member.MANHANKHAU}
                        className={`p-3 border rounded-lg ${
                          member.MANHANKHAU === selectedHousehold.IDCHUHO
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{member.HOTEN}</div>
                            <div className="text-sm text-gray-600">{member.SOCANCUOC || 'N/A'}</div>
                            <div className="text-sm text-gray-600">Số CCCD: {member.SOCANCUOC || 'N/A'}</div>
                            {member.MANHANKHAU === selectedHousehold.IDCHUHO && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                Chủ hộ
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            {!selectedHousehold.IDCHUHO && (
                              <button
                                onClick={() => handleSetHead(member.MANHANKHAU)}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Làm chủ hộ
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveMember(member.MANHANKHAU)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Xóa khỏi hộ
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">Chưa có thành viên nào</div>
                  )}
                </div>
              </div>

              {/* Available Residents */}
              <div className="flex flex-col border rounded-lg">
                <div className="p-3 bg-gray-50 border-b">
                  <div className="font-medium mb-2">Thêm thành viên mới</div>
                  <input
                    type="text"
                    value={residentSearchTerm}
                    onChange={(e) => setResidentSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên, SĐT, CCCD..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {allResidents
                    .filter((r) => {
                      // Only show residents not in this household
                      const isInHousehold = householdMembers.some(
                        (m) => m.MANHANKHAU === r.MANHANKHAU
                      );
                      if (isInHousehold) return false;

                      // Search filter
                      if (!residentSearchTerm) return true;
                      const search = residentSearchTerm.toLowerCase();
                      return (
                        r.HOTEN?.toLowerCase().includes(search) ||
                        r.SOCANCUOC?.toLowerCase().includes(search)
                      );
                    })
                    .map((resident) => (
                      <div key={resident.MANHANKHAU} className="p-3 border rounded-lg bg-white hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{resident.HOTEN}</div>
                            <div className="text-sm text-gray-600">{resident.SOCANCUOC || 'N/A'}</div>
                            <div className="text-sm text-gray-600">Số CCCD: {resident.SOCANCUOC || 'N/A'}</div>
                            {resident.MAHOKHAU && (
                              <div className="text-xs text-orange-600 mt-1">
                                Đang ở hộ khác (ID: {resident.MAHOKHAU})
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddMember(resident.MANHANKHAU)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowMemberModal(false);
                  setResidentSearchTerm('');
                  fetchHouseholds();
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

export default HouseholdManagement;
