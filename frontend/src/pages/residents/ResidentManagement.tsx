import { useEffect, useState } from 'react';
import { residentService } from '../../api/resident.service';
import type { Resident, CreateResidentRequest, UpdateResidentRequest } from '../../api/resident.service';
import { householdService } from '../../api/household.service';
import type { Household } from '../../api/household.service';

export default function ResidentManagement() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [inactiveResidents, setInactiveResidents] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInactive, setLoadingInactive] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'HOTEN' | 'SOCANCUOC' | 'NGAYSINH'>('HOTEN');
  const [inactiveSearchTerm, setInactiveSearchTerm] = useState('');
  const [inactiveSearchType, setInactiveSearchType] = useState<'HOTEN' | 'SOCANCUOC' | 'NGAYSINH'>('HOTEN');

  const [formData, setFormData] = useState<CreateResidentRequest & { MAHOKHAU: number | null }>({
    HOTEN: '',
    SOCANCUOC: '',
    SODIENTHOAI: '',
    NGAYSINH: '',
    GIOITINH: '',
    NOISINH: '',
    NGUYENQUAN: '',
    DANTOC: '',
    TONGIAO: '',
    QUOCTICH: '',
    NOITHUONGTRU: '',
    NGHENGHIEP: '',
    QUANHEVOICHUHO: '',
    GHICHU: '',
    MAHOKHAU: null,
  });

  useEffect(() => {
    loadResidents();
    loadInactiveResidents();
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    try {
      const response = await householdService.getAll({ ACTIVATE: true, include: true });
      setHouseholds(response.apartments.apartments);
    } catch (err: any) {
      console.error('❌ Load households error:', err);
    }
  };

  const loadResidents = async (search?: { [key: string]: string }) => {
    try {
      setLoading(true);
      setError('');
      const response = await residentService.getAll({
        ACTIVATE: true,
        ...search,
      });
      setResidents(response.residents.residents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách dân cư');
      console.error('❌ Load residents error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInactiveResidents = async (search?: { [key: string]: string }) => {
    try {
      setLoadingInactive(true);
      const response = await residentService.getAll({
        ACTIVATE: false,
        ...search,
      });
      setInactiveResidents(response.residents.residents);
    } catch (err: any) {
      console.error('❌ Load inactive residents error:', err);
    } finally {
      setLoadingInactive(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      loadResidents();
      return;
    }

    const searchParams: { [key: string]: string } = {};
    searchParams[searchType] = searchTerm;
    loadResidents(searchParams);
  };

  const handleInactiveSearch = () => {
    if (!inactiveSearchTerm.trim()) {
      loadInactiveResidents();
      return;
    }

    const searchParams: { [key: string]: string } = {};
    searchParams[inactiveSearchType] = inactiveSearchTerm;
    loadInactiveResidents(searchParams);
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedResident(null);
    setFormData({
      HOTEN: '',
      SOCANCUOC: '',
      NGAYSINH: '',
      GIOITINH: '',
      NOISINH: '',
      NGUYENQUAN: '',
      DANTOC: '',
      TONGIAO: '',
      QUOCTICH: '',
      NOITHUONGTRU: '',
      NGHENGHIEP: '',
      QUANHEVOICHUHO: '',
      GHICHU: '',
      MAHOKHAU: null,
    });
    setShowModal(true);
  };

  const handleEdit = (resident: Resident) => {
    setModalMode('edit');
    setSelectedResident(resident);
    setFormData({
      HOTEN: resident.HOTEN,
      SOCANCUOC: resident.SOCANCUOC || '',
      NGAYSINH: resident.NGAYSINH ? resident.NGAYSINH.split('T')[0] : '',
      GIOITINH: resident.GIOITINH || '',
      NOISINH: resident.NOISINH || '',
      NGUYENQUAN: resident.NGUYENQUAN || '',
      DANTOC: resident.DANTOC || '',
      TONGIAO: resident.TONGIAO || '',
      QUOCTICH: resident.QUOCTICH || '',
      NOITHUONGTRU: resident.NOITHUONGTRU || '',
      NGHENGHIEP: resident.NGHENGHIEP || '',
      QUANHEVOICHUHO: resident.QUANHEVOICHUHO || '',
      GHICHU: resident.GHICHU || '',
      MAHOKHAU: resident.MAHOKHAU || null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate MAHOKHAU is selected
    if (!formData.MAHOKHAU) {
      setError('Vui lòng chọn hộ khẩu!');
      alert('❌ Vui lòng chọn hộ khẩu!');
      return;
    }

    try {
      const submitData: CreateResidentRequest & { MAHOKHAU: number } = {
        HOTEN: formData.HOTEN,
        MAHOKHAU: formData.MAHOKHAU,
      };

      // Only add non-empty optional fields
      if (formData.SOCANCUOC?.trim()) submitData.SOCANCUOC = formData.SOCANCUOC;
      if (formData.NGAYSINH?.trim()) submitData.NGAYSINH = formData.NGAYSINH;
      if (formData.GIOITINH?.trim()) submitData.GIOITINH = formData.GIOITINH;
      if (formData.NOISINH?.trim()) submitData.NOISINH = formData.NOISINH;
      if (formData.NGUYENQUAN?.trim()) submitData.NGUYENQUAN = formData.NGUYENQUAN;
      if (formData.DANTOC?.trim()) submitData.DANTOC = formData.DANTOC;
      if (formData.TONGIAO?.trim()) submitData.TONGIAO = formData.TONGIAO;
      if (formData.QUOCTICH?.trim()) submitData.QUOCTICH = formData.QUOCTICH;
      if (formData.NOITHUONGTRU?.trim()) submitData.NOITHUONGTRU = formData.NOITHUONGTRU;
      if (formData.NGHENGHIEP?.trim()) submitData.NGHENGHIEP = formData.NGHENGHIEP;
      if (formData.QUANHEVOICHUHO?.trim()) submitData.QUANHEVOICHUHO = formData.QUANHEVOICHUHO;
      if (formData.GHICHU?.trim()) submitData.GHICHU = formData.GHICHU;

      if (modalMode === 'create') {
        await residentService.create(submitData);
        alert('✅ Thêm nhân khẩu thành công!');
      } else if (selectedResident) {
        await residentService.update(selectedResident.MANHANKHAU, submitData as UpdateResidentRequest);
        alert('✅ Cập nhật nhân khẩu thành công!');
      }

      setShowModal(false);
      loadResidents();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra';
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
      console.error('❌ Submit error:', err);
    }
  };

  const handleDelete = async (resident: Resident) => {
    if (!window.confirm(`Bạn có chắc muốn xóa dân cư "${resident.HOTEN}"?`)) return;

    try {
      await residentService.delete(resident.MANHANKHAU);
      alert(`✅ Đã xóa dân cư "${resident.HOTEN}" thành công!`);
      // Reload cả 2 danh sách (active và inactive)
      loadResidents();
      loadInactiveResidents();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Không thể xóa dân cư';
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
      console.error('❌ Delete error:', err);
    }
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
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Quản lý Dân cư</h3>
          <p className="text-sm text-gray-500">Quản lý thông tin nhân khẩu trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <span> </span> Thêm Dân cư
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex gap-3">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="HOTEN">Họ tên</option>
            <option value="SOCANCUOC">Số căn cước</option>
            <option value="NGAYSINH">Ngày sinh</option>
          </select>
          <input
            type={searchType === 'NGAYSINH' ? 'date' : 'text'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Tìm kiếm theo ${searchType === 'HOTEN' ? 'họ tên' : searchType === 'SOCANCUOC' ? 'số căn cước' : 'ngày sinh'}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔍 Tìm
          </button>
          <button
            onClick={() => { setSearchTerm(''); loadResidents(); }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ↻ Reset
          </button>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số căn cước</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nơi ở</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nghề nghiệp</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {residents.map((resident) => (
                <tr key={resident.MANHANKHAU} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.MANHANKHAU}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resident.HOTEN}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.SOCANCUOC || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.NGAYSINH ? new Date(resident.NGAYSINH).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.GIOITINH || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.HOKHAU ? `${resident.HOKHAU.MAPHONG} (${resident.HOKHAU.LOAICANHO})` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.NGHENGHIEP || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(resident)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(resident)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Residents Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Danh sách Dân cư Đã Xóa</h2>
        
        {/* Search for inactive residents */}
        <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="flex gap-2">
                <select
                  value={inactiveSearchType}
                  onChange={(e) => setInactiveSearchType(e.target.value as 'HOTEN' | 'SOCANCUOC' | 'NGAYSINH')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HOTEN">Họ tên</option>
                  <option value="SOCANCUOC">Số căn cước</option>
                  <option value="NGAYSINH">Ngày sinh</option>
                </select>
                <input
                  type={inactiveSearchType === 'NGAYSINH' ? 'date' : 'text'}
                  value={inactiveSearchTerm}
                  onChange={(e) => setInactiveSearchTerm(e.target.value)}
                  placeholder={`Nhập ${inactiveSearchType === 'HOTEN' ? 'họ tên' : inactiveSearchType === 'SOCANCUOC' ? 'số căn cước' : 'ngày sinh'}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleInactiveSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔍 Tìm
            </button>
            <button
              onClick={() => { setInactiveSearchTerm(''); loadInactiveResidents(); }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ↻ Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số căn cước</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nghề nghiệp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày xóa</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingInactive ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : inactiveResidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Không có dân cư đã xóa
                    </td>
                  </tr>
                ) : (
                  inactiveResidents.map((resident) => (
                    <tr key={resident.MANHANKHAU} className="hover:bg-gray-50 bg-red-50 opacity-70">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.MANHANKHAU}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resident.HOTEN}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.SOCANCUOC || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resident.NGAYSINH ? new Date(resident.NGAYSINH).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.GIOITINH || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.NGHENGHIEP || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resident.NGAYKETTHUC ? new Date(resident.NGAYKETTHUC).toLocaleDateString('vi-VN') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <h3 className="text-lg font-bold mb-4">
              {modalMode === 'create' ? 'Thêm Dân cư Mới' : 'Chỉnh Sửa Dân cư'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hộ khẩu <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.MAHOKHAU || ''}
                    onChange={(e) => setFormData({ ...formData, MAHOKHAU: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn hộ khẩu --</option>
                    {households.map((household) => (
                      <option key={household.MAHOKHAU} value={household.MAHOKHAU}>
                        {household.MAPHONG} - {household.THONGTINCHUHO?.HOTEN || '(Chưa có chủ hộ)'}
                      </option>
                    ))}
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số căn cước</label>
                  <input
                    type="text"
                    value={formData.SOCANCUOC}
                    onChange={(e) => setFormData({ ...formData, SOCANCUOC: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.SODIENTHOAI}
                    onChange={(e) => setFormData({ ...formData, SODIENTHOAI: e.target.value })}
                    placeholder="Ví dụ: 0123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.NGAYSINH}
                    onChange={(e) => setFormData({ ...formData, NGAYSINH: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select
                    value={formData.GIOITINH}
                    onChange={(e) => setFormData({ ...formData, GIOITINH: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nơi sinh</label>
                  <input
                    type="text"
                    value={formData.NOISINH}
                    onChange={(e) => setFormData({ ...formData, NOISINH: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nguyên quán</label>
                  <input
                    type="text"
                    value={formData.NGUYENQUAN}
                    onChange={(e) => setFormData({ ...formData, NGUYENQUAN: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dân tộc</label>
                  <input
                    type="text"
                    value={formData.DANTOC}
                    onChange={(e) => setFormData({ ...formData, DANTOC: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tôn giáo</label>
                  <input
                    type="text"
                    value={formData.TONGIAO}
                    onChange={(e) => setFormData({ ...formData, TONGIAO: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quốc tịch</label>
                  <input
                    type="text"
                    value={formData.QUOCTICH}
                    onChange={(e) => setFormData({ ...formData, QUOCTICH: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nơi thường trú</label>
                  <input
                    type="text"
                    value={formData.NOITHUONGTRU}
                    onChange={(e) => setFormData({ ...formData, NOITHUONGTRU: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={formData.NGHENGHIEP}
                    onChange={(e) => setFormData({ ...formData, NGHENGHIEP: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quan hệ với chủ hộ</label>
                  <input
                    type="text"
                    value={formData.QUANHEVOICHUHO}
                    onChange={(e) => setFormData({ ...formData, QUANHEVOICHUHO: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Chủ hộ, Con, Vợ/Chồng, v.v."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={formData.GHICHU}
                  onChange={(e) => setFormData({ ...formData, GHICHU: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
