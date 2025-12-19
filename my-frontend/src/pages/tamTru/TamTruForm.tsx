import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tamTruService } from '../../api/tamTru.service';

export default function TamTruForm() {
  const navigate = useNavigate();
  // State theo cnpm.sql: TAMTRU
  const [formData, setFormData] = useState({
    maNhanKhau: '', 
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

  // Style chung cho input
  const inputStyle = { padding: 8, border: '1px solid #ccc', borderRadius: 4 };

  return (
    <div style={{ padding: 20 }}>
      <h3>Đăng Ký Tạm Trú</h3>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label style={{ fontWeight: 'bold' }}>Mã Nhân Khẩu (ID người dân):</label>
        <input 
          name="maNhanKhau" 
          type="number" 
          value={formData.maNhanKhau} 
          onChange={handleChange} 
          required 
          placeholder="Nhập ID..." 
          style={inputStyle}
        />

        <label style={{ fontWeight: 'bold' }}>Số Điện Thoại:</label>
        <input 
          name="soDienThoaiNguoiDangKy" 
          value={formData.soDienThoaiNguoiDangKy} 
          onChange={handleChange} 
          required 
          style={inputStyle}
        />

        <div style={{display: 'flex', gap: 20}}>
            <div style={{flex: 1}}>
                <label style={{ fontWeight: 'bold' }}>Từ Ngày:</label><br/>
                <input 
                  type="date" 
                  name="tuNgay" 
                  value={formData.tuNgay} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', marginTop: 5, ...inputStyle }}
                />
            </div>
            <div style={{flex: 1}}>
                <label style={{ fontWeight: 'bold' }}>Đến Ngày:</label><br/>
                <input 
                  type="date" 
                  name="denNgay" 
                  value={formData.denNgay} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', marginTop: 5, ...inputStyle }}
                />
            </div>
        </div>

        <label style={{ fontWeight: 'bold' }}>Lý Do:</label>
        <textarea 
          name="lyDo" 
          value={formData.lyDo} 
          onChange={handleChange} 
          required 
          rows={4}
          style={inputStyle}
        />

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
                    fontWeight: 'bold',
                    marginRight: 10
                }}
            >
                Hoàn Tất
            </button>
            
            <button 
                type="button" 
                onClick={() => navigate('/tam-tru')}
                style={{ 
                    padding: '10px 20px', 
                    background: '#f0f0f0', 
                    border: '1px solid #ccc', 
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