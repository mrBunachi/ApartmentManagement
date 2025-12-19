import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tamVangService } from '../../api/tamVang.service';
import Table from '../../components/Table';

export default function TamVangList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    tamVangService.getAll().then((res: any) => setRows(res.data || res)).catch(console.error);
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'maNhanKhau', headerName: 'Mã NK', width: 80 },
    { field: 'noTamTru', headerName: 'Nơi Đến (Tạm trú)', width: 200 }, // Chú ý: SQL ghi là NOTAMTRU (Nơi tạm trú)
    { field: 'tuNgay', headerName: 'Từ Ngày', width: 120 },
    { field: 'denNgay', headerName: 'Đến Ngày', width: 120 },
    { field: 'lyDo', headerName: 'Lý Do', width: 200 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2>Danh Sách Tạm Vắng</h2>
        <Link to="/tam-vang/create"><button style={{ padding: 10, background: 'orange', color: 'white' }}>+ Khai Báo Tạm Vắng</button></Link>
      </div>
      <Table columns={columns} rows={rows} onDelete={async (id) => {
          if(confirm('Xóa đơn này?')) { await tamVangService.delete(id); window.location.reload(); }
      }} />
    </div>
  );
}