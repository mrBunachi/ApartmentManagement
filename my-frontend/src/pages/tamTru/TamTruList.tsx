import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tamTruService } from '../../api/tamTru.service';
import Table from '../../components/Table';

export default function TamTruList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    tamTruService.getAll().then((res: any) => setRows(res.data || res)).catch(console.error);
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID ĐK', width: 60 },
    { field: 'maNhanKhau', headerName: 'Mã NK', width: 80 }, // ID người đăng ký
    { field: 'soDienThoaiNguoiDangKy', headerName: 'SĐT', width: 120 },
    { field: 'tuNgay', headerName: 'Từ Ngày', width: 120 },
    { field: 'denNgay', headerName: 'Đến Ngày', width: 120 },
    { field: 'lyDo', headerName: 'Lý Do', width: 200 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2>Danh Sách Tạm Trú</h2>
        <Link to="/tam-tru/create"><button style={{ padding: 10, background: 'green', color: 'white' }}>+ Đăng Ký Tạm Trú</button></Link>
      </div>
      <Table columns={columns} rows={rows} onDelete={async (id) => {
          if(confirm('Xóa đơn này?')) { await tamTruService.delete(id); window.location.reload(); }
      }} />
    </div>
  );
}