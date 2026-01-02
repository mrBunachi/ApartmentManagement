import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hoKhauService } from '../../api/hoKhau.service'; // Nhớ có ngoặc nhọn {}
import Table from '../../components/Table';

export default function HoKhauList() {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    try {
      const res: any = await hoKhauService.getAll();
      // Backend trả về: { message, apartments: { apartments: [...], count: X } }
      const apartmentsList = res.apartments?.apartments || res.apartments || [];
      setRows(apartmentsList);
    } catch (err) { 
      console.error(err); 
      setRows([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: any) => {
    if(confirm('Bạn có chắc muốn xóa hộ khẩu này?')) {
        await hoKhauService.delete(id);
        loadData();
    }
  };

  // Cấu hình cột - Backend trả về UPPERCASE
  const columns = [
    { field: 'MAHOKHAU', headerName: 'ID', width: 50 },
    { field: 'MAPHONG', headerName: 'Mã Phòng', width: 100 },
    { field: 'LOAICANHO', headerName: 'Loại Căn Hộ', width: 150 },
    { field: 'DIACHI', headerName: 'Địa Chỉ', width: 250 },
    { field: 'XEMAY', headerName: 'Xe Máy', width: 80 },
    { field: 'OTO', headerName: 'Ô Tô', width: 80 },
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