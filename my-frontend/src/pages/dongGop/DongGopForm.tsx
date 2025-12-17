import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dongGopService } from '../../api/dongGop.service';

export default function DongGopForm() {
  const navigate = useNavigate();
  
  // State theo cnpm.sql: DONGGOP
  const [formData, setFormData] = useState({
    maDotThu: '',   // ID đợt thu
    maHoKhau: '',   // ID hộ khẩu đóng tiền
    soTienDaDong: '', 
    ngayDong: new Date().toISOString().split('T')[0] // Mặc định hôm nay
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await dongGopService.create({
          ...formData,
          maDotThu: parseInt(formData.maDotThu),
          maHoKhau: parseInt(formData.maHoKhau),
          soTienDaDong: parseFloat(formData.soTienDaDong)
      });
      alert('Đã ghi nhận đóng tiền!');
      navigate('/dong-gop');
    } catch (err) { alert('Lỗi! Kiểm tra lại Mã Đợt Thu hoặc Mã Hộ Khẩu'); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: 20 }}>
      <h3>Ghi Nhận Đóng Phí / Ủng Hộ</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label>Mã Đợt Thu (ID):</label>
        <input name="maDotThu" type="number" value={formData.maDotThu} onChange={handleChange} required placeholder="Nhập ID đợt thu..." />
        {/* Nếu có thời gian, nên thay cái này bằng Dropdown Select load từ API dotThuPhi */}

        <label>Mã Hộ Khẩu (ID):</label>
        <input name="maHoKhau" type="number" value={formData.maHoKhau} onChange={handleChange} required placeholder="Nhập ID hộ khẩu..." />

        <label>Số Tiền Đóng:</label>
        <input name="soTienDaDong" type="number" value={formData.soTienDaDong} onChange={handleChange} required />

        <label>Ngày Đóng:</label>
        <input type="date" name="ngayDong" value={formData.ngayDong} onChange={handleChange} />

        <div>
            <button type="submit" style={{ background: 'blue', color: 'white', padding: 10 }}>Xác Nhận Thu Tiền</button>
            <button type="button" onClick={() => navigate('/dong-gop')} style={{ marginLeft: 10 }}>Hủy</button>
        </div>
      </form>
    </div>
  );
}