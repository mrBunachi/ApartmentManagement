import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hoKhauService } from '../../api/hoKhau.service'; // Nhớ ngoặc nhọn {}

export default function HoKhauForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State khớp với bảng HOKHAU
  const [formData, setFormData] = useState({
    tenChuHo: '',
    idChuHo: '', // Nhập ID của nhân khẩu làm chủ hộ
    maPhong: '',
    loaiCanHo: 'Cao cấp', // Giá trị mặc định
    diaChi: '',
    ghiChu: '',
    xeMay: 0,
    oTo: 0
  });

  useEffect(() => {
    if (id) {
      hoKhauService.getById(id).then((res: any) => setFormData(res.data || res));
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Convert idChuHo sang số để gửi lên backend (nếu backend cần số)
      const payload = {
        ...formData,
        idChuHo: formData.idChuHo ? parseInt(formData.idChuHo) : null
      };

      if (id) await hoKhauService.update(id, payload);
      else await hoKhauService.create(payload);
      
      alert('Lưu hộ khẩu thành công!');
      navigate('/ho-khau');
    } catch (error) {
      console.error(error);
      alert('Lỗi lưu dữ liệu (Kiểm tra xem ID Chủ Hộ có tồn tại không?)');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>{id ? 'Cập Nhật' : 'Thêm Mới'} Hộ Khẩu</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 10 }}>
        
        <label>Tên Chủ Hộ (*):</label>
        <input name="tenChuHo" value={formData.tenChuHo} onChange={handleChange} required />

        <label>ID Chủ Hộ (Nhập số ID nhân khẩu):</label>
        <input name="idChuHo" type="number" value={formData.idChuHo} onChange={handleChange} required placeholder="Ví dụ: 10" />

        <label>Mã Phòng (*):</label>
        <input name="maPhong" value={formData.maPhong} onChange={handleChange} required />

        <label>Loại Căn Hộ:</label>
        <select name="loaiCanHo" value={formData.loaiCanHo} onChange={handleChange}>
            <option value="Cao cấp">Cao cấp</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Giá rẻ">Giá rẻ</option>
        </select>

        <label>Địa Chỉ:</label>
        <input name="diaChi" value={formData.diaChi} onChange={handleChange} />

        <div style={{ display: 'flex', gap: 20 }}>
            <div>
                <label>Số xe máy:</label><br/>
                <input type="number" name="xeMay" value={formData.xeMay} onChange={handleChange} style={{width: 60}} />
            </div>
            <div>
                <label>Số ô tô:</label><br/>
                <input type="number" name="oTo" value={formData.oTo} onChange={handleChange} style={{width: 60}} />
            </div>
        </div>

        <label>Ghi chú:</label>
        <textarea name="ghiChu" value={formData.ghiChu} onChange={handleChange} />

        <div style={{ marginTop: 20 }}>
            <button type="submit" style={{ background: 'blue', color: 'white', padding: 10, marginRight: 10 }}>Lưu Lại</button>
            <button type="button" onClick={() => navigate('/ho-khau')}>Hủy</button>
        </div>
      </form>
    </div>
  );
}