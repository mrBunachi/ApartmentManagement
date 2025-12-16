import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nhanKhauService } from '../../api/nhanKhau.service';

export default function NhanKhauForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL nếu đang sửa

  // Chuẩn theo bảng NHANKHAU trong cnpm.sql
  const [formData, setFormData] = useState({
    maHoKhau: '', // Nhập ID hộ khẩu (tạm thời nhập số, sau này làm dropdown chọn căn hộ)
    hoTen: '',
    soCanCuoc: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    noiSinh: '',
    nguyenQuan: '',
    danToc: 'Kinh',
    tonGiao: 'Không',
    quocTich: 'Việt Nam',
    noiThuongTru: '',
    ngheNghiep: '',
    quanHeVoiChuHo: '', // Ví dụ: Chủ hộ, Vợ, Con...
    ghiChu: ''
  });

  // Nếu có ID (đang sửa) thì load dữ liệu cũ
  useEffect(() => {
    if (id) {
      loadDetail(id);
    }
  }, [id]);

  const loadDetail = async (id: string) => {
    try {
      const res: any = await nhanKhauService.getById(id);
      // Map dữ liệu từ backend vào form (Lưu ý: Backend trả về field viết hoa hay thường thì sửa lại cho khớp nhé)
      setFormData(res.data || res); 
    } catch (err) { console.error(err); }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Convert maHoKhau sang số nếu cần thiết
      const payload = { 
        ...formData, 
        maHoKhau: formData.maHoKhau ? parseInt(formData.maHoKhau) : null 
      };

      if (id) await nhanKhauService.update(id, payload);
      else await nhanKhauService.create(payload);
      
      alert('Lưu thành công!');
      navigate('/nhan-khau');
    } catch (error) {
      console.error(error);
      alert('Lỗi! Kiểm tra lại xem Mã Hộ Khẩu có tồn tại không?');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>{id ? 'Cập Nhật' : 'Thêm Mới'} Cư Dân (Chung Cư)</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* Cột 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label>Mã Hộ Khẩu (ID căn hộ):</label>
          <input name="maHoKhau" type="number" value={formData.maHoKhau} onChange={handleChange} placeholder="Nhập ID hộ..." />

          <label>Họ Tên (*):</label>
          <input name="hoTen" value={formData.hoTen} onChange={handleChange} required />

          <label>Số CCCD/CMND (*):</label>
          <input name="soCanCuoc" value={formData.soCanCuoc} onChange={handleChange} required />

          <label>Ngày Sinh (*):</label>
          <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} required />

          <label>Giới Tính:</label>
          <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <label>Quan hệ với chủ hộ:</label>
          <input name="quanHeVoiChuHo" value={formData.quanHeVoiChuHo} onChange={handleChange} placeholder="VD: Chủ hộ, Con..." />
        </div>

        {/* Cột 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label>Nơi thường trú:</label>
          <input name="noiThuongTru" value={formData.noiThuongTru} onChange={handleChange} />

          <label>Quê quán:</label>
          <input name="nguyenQuan" value={formData.nguyenQuan} onChange={handleChange} />
          
          <label>Dân tộc:</label>
          <input name="danToc" value={formData.danToc} onChange={handleChange} />

          <label>Tôn giáo:</label>
          <input name="tonGiao" value={formData.tonGiao} onChange={handleChange} />
          
          <label>Quốc tịch:</label>
          <input name="quocTich" value={formData.quocTich} onChange={handleChange} />

          <label>Nghề nghiệp:</label>
          <input name="ngheNghiep" value={formData.ngheNghiep} onChange={handleChange} />

          <label>Ghi chú:</label>
          <input name="ghiChu" value={formData.ghiChu} onChange={handleChange} />
        </div>

        <div style={{ gridColumn: 'span 2', marginTop: 20 }}>
           <button type="submit" style={{ background: 'blue', color: 'white', padding: 10, marginRight: 10 }}>Lưu Dữ Liệu</button>
           <button type="button" onClick={() => navigate('/nhan-khau')}>Hủy</button>
        </div>
      </form>
    </div>
  );
}