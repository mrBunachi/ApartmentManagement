import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hoKhauService } from '../../api/hoKhau.service';

export default function HoKhauForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State khớp với bảng HOKHAU
  const [formData, setFormData] = useState({
    tenChuHo: '',
    idChuHo: '', 
    maPhong: '',
    loaiCanHo: 'Cao cấp',
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
      const payload = {
        ...formData,
        idChuHo: formData.idChuHo ? parseInt(formData.idChuHo.toString()) : null
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
      
      {/* Tăng gap lên 15 cho thoáng */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label>Tên Chủ Hộ (*):</label>
        <input name="tenChuHo" value={formData.tenChuHo} onChange={handleChange} required style={{ padding: 8 }} />

        <label>ID Chủ Hộ (Nhập số ID nhân khẩu):</label>
        <input name="idChuHo" type="number" value={formData.idChuHo} onChange={handleChange} required placeholder="Ví dụ: 10" style={{ padding: 8 }} />

        <label>Mã Phòng (*):</label>
        <input name="maPhong" value={formData.maPhong} onChange={handleChange} required style={{ padding: 8 }} />

        <label>Loại Căn Hộ:</label>
        <select name="loaiCanHo" value={formData.loaiCanHo} onChange={handleChange} style={{ padding: 8 }}>
            <option value="Cao cấp">Cao cấp</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Giá rẻ">Giá rẻ</option>
        </select>

        <label>Địa Chỉ:</label>
        <input name="diaChi" value={formData.diaChi} onChange={handleChange} style={{ padding: 8 }} />

        <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
                <label>Số xe máy:</label><br/>
                <input type="number" name="xeMay" value={formData.xeMay} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 5 }} />
            </div>
            <div style={{ flex: 1 }}>
                <label>Số ô tô:</label><br/>
                <input type="number" name="oTo" value={formData.oTo} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 5 }} />
            </div>
        </div>

        <label>Ghi chú:</label>
        <textarea name="ghiChu" value={formData.ghiChu} onChange={handleChange} rows={3} style={{ padding: 8 }} />

        {/* Nút bấm style chuẩn */}
        <div style={{ marginTop: 10 }}>
            <button 
                type="submit" 
                style={{ 
                    background: 'blue', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: 4, 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Lưu Lại
            </button>
            
            <button 
                type="button" 
                onClick={() => navigate('/ho-khau')}
                style={{ 
                    marginLeft: 10, 
                    padding: '10px 20px', 
                    border: '1px solid #ccc', 
                    background: '#f0f0f0', 
                    borderRadius: 4, 
                    cursor: 'pointer' 
                }}
            >
                Hủy
            </button>
        </div>
      </form>
    </div>
  );
}