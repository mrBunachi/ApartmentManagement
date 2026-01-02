import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dongGopService } from '../../api/dongGop.service';
import Table from '../../components/Table';

export default function DongGopList() {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    try {
      const res: any = await dongGopService.getAll();
      // Backend trả về: { message, data: [...], pagination: {...} }
      setRows(res.data || []);
    } catch (err) { 
      console.error(err); 
      setRows([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = [
    { field: 'MADONGGOP', headerName: 'ID', width: 50 },
    { field: 'MADOTTHU', headerName: 'Đợt Thu', width: 200 },
    { field: 'MAHOKHAU', headerName: 'Mã HK', width: 150 },
    { field: 'SOTIENDADONG', headerName: 'Số Tiền', width: 120 },
    { field: 'NGAYDONG', headerName: 'Ngày Đóng', width: 150 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2>Lịch Sử Đóng Góp</h2>
        <Link to="/dong-gop/create">
            <button style={{ padding: 10, background: 'green', color: 'white' }}>+ Ghi Nhận Đóng Phí</button>
        </Link>
      </div>
      {/* Module này thường chỉ xem và xóa lịch sử sai, ít khi sửa */}
      <Table columns={columns} rows={rows} onDelete={async (id) => {
          if(confirm('Xóa lịch sử đóng này?')) { await dongGopService.delete(id); loadData(); }
      }} />
    </div>
  );
}