import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nhanKhauService } from '../../api/nhanKhau.service';

export default function NhanKhauForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Chuẩn theo bảng NHANKHAU trong schema.prisma
  const [formData, setFormData] = useState({
    MAHOKHAU: '',
    HOTEN: '',
    SOCANCUOC: '',
    NGAYSINH: '',
    GIOITINH: 'Nam',
    NOISINH: '',
    NGUYENQUAN: '',
    DANTOC: 'Kinh',
    TONGIAO: 'Không',
    QUOCTICH: 'Việt Nam',
    NOITHUONGTRU: '',
    NGHENGHIEP: '',
    QUANHEVOICHUHO: '',
    GHICHU: ''
  });

  useEffect(() => {
    if (id) {
      loadDetail(id);
    }
  }, [id]);

  const loadDetail = async (id: string) => {
    try {
      const res: any = await nhanKhauService.getById(id);
      // Backend trả về: { message, residents: [single_item] }
      const residentData = res.residents?.[0] || res.resident || res;
      setFormData(residentData); 
    } catch (err) { 
      console.error(err);
      alert('Không tải được thông tin cư dân');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        MAHOKHAU: formData.MAHOKHAU ? parseInt(formData.MAHOKHAU.toString()) : null 
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

  // Style chung cho input để đỡ lặp lại code
  const inputStyle = { padding: 8, border: '1px solid #ccc', borderRadius: 4 };

  return (
    <div style={{ padding: 20 }}>
      <h3>{id ? 'Cập Nhật' : 'Thêm Mới'} Cư Dân (Chung Cư)</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, maxWidth: 1000 }}>
        
        {/* Cột 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Mã Hộ Khẩu (ID căn hộ):</label>
            <input name="MAHOKHAU" type="number" value={formData.MAHOKHAU} onChange={handleChange} placeholder="Nhập ID hộ..." style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Họ Tên (*):</label>
            <input name="HOTEN" value={formData.HOTEN} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Số CCCD/CMND (*):</label>
            <input name="SOCANCUOC" value={formData.SOCANCUOC} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Ngày Sinh (*):</label>
            <input type="date" name="NGAYSINH" value={formData.NGAYSINH} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Giới Tính:</label>
            <select name="GIOITINH" value={formData.GIOITINH} onChange={handleChange} style={inputStyle}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Quan hệ với chủ hộ:</label>
            <input name="QUANHEVOICHUHO" value={formData.QUANHEVOICHUHO} onChange={handleChange} placeholder="VD: Chủ hộ, Con..." style={inputStyle} />
          </div>
        </div>

        {/* Cột 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Nơi thường trú:</label>
            <input name="NOITHUONGTRU" value={formData.NOITHUONGTRU} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Quê quán:</label>
            <input name="NGUYENQUAN" value={formData.NGUYENQUAN} onChange={handleChange} style={inputStyle} />
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Dân tộc:</label>
            <input name="DANTOC" value={formData.DANTOC} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Tôn giáo:</label>
            <input name="TONGIAO" value={formData.TONGIAO} onChange={handleChange} style={inputStyle} />
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Quốc tịch:</label>
            <input name="QUOCTICH" value={formData.QUOCTICH} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Nghề nghiệp:</label>
            <input name="NGHENGHIEP" value={formData.NGHENGHIEP} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label style={{fontWeight: 'bold'}}>Ghi chú:</label>
            <input name="GHICHU" value={formData.GHICHU} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Khu vực nút bấm */}
        <div style={{ gridColumn: 'span 2', marginTop: 10 }}>
            <button 
                type="submit" 
                style={{ 
                    background: 'blue', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: 4, 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    marginRight: 10
                }}
            >
                Lưu Dữ Liệu
            </button>
            
            <button 
                type="button" 
                onClick={() => navigate('/nhan-khau')}
                style={{ 
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