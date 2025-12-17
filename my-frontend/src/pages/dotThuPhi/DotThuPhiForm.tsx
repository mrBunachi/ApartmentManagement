import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dotThuPhiService } from '../../api/dotThuPhi.service';

export default function DotThuPhiForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State theo cnpm.sql: DOTTHUPHI
  const [formData, setFormData] = useState({
    ten: '',
    batBuoc: 1, // Mặc định là bắt buộc (1)
    moTa: ''
  });

  useEffect(() => {
    if (id) {
      dotThuPhiService.getById(id).then((res: any) => setFormData(res.data || res));
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = { ...formData, batBuoc: Number(formData.batBuoc) };
      if (id) await dotThuPhiService.update(id, payload);
      else await dotThuPhiService.create(payload);
      navigate('/dot-thu-phi');
    } catch (err) { alert('Lỗi lưu dữ liệu'); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: 20 }}>
      <h3>{id ? 'Sửa' : 'Tạo'} Đợt Thu Phí</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
        
        <label>Tên Đợt Thu (VD: Tiền điện T10/2025):</label>
        <input name="ten" value={formData.ten} onChange={handleChange} required />

        <label>Loại Phí:</label>
        <select name="batBuoc" value={formData.batBuoc} onChange={handleChange}>
            <option value={1}>Bắt buộc (Điện, Nước, Vệ sinh)</option>
            <option value={0}>Tự nguyện (Quyên góp, Từ thiện)</option>
        </select>

        <label>Mô Tả Chi Tiết:</label>
        <textarea name="moTa" value={formData.moTa} onChange={handleChange} rows={4} />

        <div>
            <button type="submit" style={{ background: 'blue', color: 'white', padding: 10 }}>Lưu Lại</button>
            <button type="button" onClick={() => navigate('/dot-thu-phi')} style={{ marginLeft: 10 }}>Hủy</button>
        </div>
      </form>
    </div>
  );
}