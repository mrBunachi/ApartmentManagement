import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tamVangService } from '../../api/tamVang.service';

export default function TamVangForm() {
  const navigate = useNavigate();
  
  // State theo cnpm.sql: TAMVANG
  const [formData, setFormData] = useState({
    maNhanKhau: '',
    noTamTru: '', // Nơi người dân sẽ đến ở tạm
    tuNgay: '',
    denNgay: '',
    lyDo: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await tamVangService.create({ ...formData, maNhanKhau: parseInt(formData.maNhanKhau) });
      alert('Khai báo thành công!');
      navigate('/tam-vang');
    } catch (err) { alert('Lỗi! Kiểm tra mã nhân khẩu.'); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: 20 }}>
      <h3>Khai Báo Tạm Vắng</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label>Mã Nhân Khẩu (ID người đi vắng):</label>
        <input name="maNhanKhau" type="number" value={formData.maNhanKhau} onChange={handleChange} required />

        <label>Nơi đến tạm trú (Địa chỉ nơi đến):</label>
        <input name="noTamTru" value={formData.noTamTru} onChange={handleChange} required />

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