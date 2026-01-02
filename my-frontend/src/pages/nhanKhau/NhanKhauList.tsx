import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { nhanKhauService } from '../../api/nhanKhau.service';
import Table from '../../components/Table'; // Tận dụng lại cái Table "xấu nhưng chạy được" lúc nãy

export default function NhanKhauList() {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    try {
      const res: any = await nhanKhauService.getAll();
      // Backend trả về: { message, residents: { residents: [...], count: X } }
      const residentsList = res.residents?.residents || res.residents || [];
      setRows(residentsList); 
    } catch (err) { 
      console.error(err); 
      setRows([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: any) => {
    if(confirm('Bạn chắc chắn muốn xóa cư dân này?')) {
        await nhanKhauService.delete(id);
        loadData();
    }
  };

  // Định nghĩa cột hiển thị - Backend trả về UPPERCASE
  const columns = [
    { field: 'MANHANKHAU', headerName: 'ID', width: 50 },
    { field: 'HOTEN', headerName: 'Họ Tên', width: 150 },
    { field: 'MAHOKHAU', headerName: 'Mã Hộ', width: 80 },
    { field: 'QUANHEVOICHUHO', headerName: 'Quan Hệ', width: 100 },
    { field: 'SOCANCUOC', headerName: 'CCCD', width: 120 },
    { field: 'GIOITINH', headerName: 'Giới Tính', width: 80 },
    { field: 'NGAYSINH', headerName: 'Ngày Sinh', width: 100 },
    { field: 'NOITHUONGTRU', headerName: 'Thường Trú', width: 200 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2>Danh Sách Cư Dân Chung Cư</h2>
        <Link to="/nhan-khau/create">
            <button style={{ padding: 10, background: 'green', color: 'white' }}>+ Thêm Cư Dân</button>
        </Link>
      </div>

      {/* Truyền thêm hàm sửa/xóa vào Table */}
      <Table 
        columns={columns} 
        rows={rows} 
        onEdit={(id) => window.location.href = `/nhan-khau/edit/${id}`} 
        onDelete={handleDelete}
      />
    </div>
  );
}