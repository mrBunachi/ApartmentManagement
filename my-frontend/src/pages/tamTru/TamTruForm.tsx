import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tamTruService } from '../../api/tamTru.service';

export default function TamTruForm() {
  const navigate = useNavigate();
  // State theo cnpm.sql: TAMTRU
  const [formData, setFormData] = useState({
    maNhanKhau: '', // ID người từ bảng NHANKHAU
    soDienThoaiNguoiDangKy: '',
    tuNgay: '',
    denNgay: '',
    lyDo: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await tamTruService.create({ ...formData, maNhanKhau: parseInt(formData.maNhanKhau) });
      alert('Đăng ký thành công!');
      navigate('/tam-tru');
    } catch (err) { alert('Lỗi! Kiểm tra mã nhân khẩu có tồn tại không.'); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: 20 }}>
      <h3>Đăng Ký Tạm Trú</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label>Mã Nhân Khẩu (ID người dân):</label>
        <input name="maNhanKhau" type="number" value={formData.maNhanKhau} onChange={handleChange} required placeholder="Nhập ID..." />

        <label>Số Điện Thoại:</label>
        <input name="soDienThoaiNguoiDangKy" value={formData.soDienThoaiNguoiDangKy} onChange={handleChange} required />

        <div style={{display: 'flex', gap: 10}}>
            <div style={{flex: 1}}>
                <label>Từ Ngày:</label><br/>
                <input type="date" name="tuNgay" value={formData.tuNgay} onChange={handleChange} required style={{width: '100%'}}/>
            </div>
            <div style={{flex: 1}}>
                <label>Đến Ngày:</label><br/>
                <input type="date" name="denNgay" value={formData.denNgay} onChange={handleChange} required style={{width: '100%'}}/>
            </div>
        </div>

        <label>Lý Do:</label>
        <textarea name="lyDo" value={formData.lyDo} onChange={handleChange} required />

        <button type="submit" style={{ background: 'blue', color: 'white', padding: 10 }}>Hoàn Tất</button>
      </form>
    </div>
  );
}