import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hoKhauService } from '../../api/hoKhau.service'; // Nhớ có ngoặc nhọn {}
import Table from '../../components/Table';

export default function HoKhauList() {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    try {
      const res: any = await hoKhauService.getAll();
      setRows(res.data || res);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: any) => {
    if(confirm('Bạn có chắc muốn xóa hộ khẩu này?')) {
        await hoKhauService.delete(id);
        loadData();
    }
  };

  // Cấu hình cột theo bảng HOKHAU trong cnpm.sql
  const columns = [
    { field: 'id', headerName: 'ID', width: 50 }, // Map với MAHOKHAU
    { field: 'tenChuHo', headerName: 'Tên Chủ Hộ', width: 200 }, // TENCHUHO
    { field: 'maPhong', headerName: 'Mã Phòng', width: 100 }, // MAPHONG
    { field: 'loaiCanHo', headerName: 'Loại Căn Hộ', width: 150 }, // LOAICANHO
    { field: 'diaChi', headerName: 'Địa Chỉ', width: 250 }, // DIACHI
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2>Quản Lý Hộ Khẩu (Căn Hộ)</h2>
        <Link to="/ho-khau/create">
            <button style={{ padding: 10, background: 'green', color: 'white' }}>+ Thêm Hộ Mới</button>
        </Link>
      </div>
      
      <Table 
        columns={columns} 
        rows={rows} 
        onEdit={(id) => window.location.href = `/ho-khau/edit/${id}`} 
        onDelete={handleDelete}
      />
    </div>
  );
}