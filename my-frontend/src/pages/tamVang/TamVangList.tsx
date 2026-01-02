import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tamVangService } from '../../api/tamVang.service';
import Table from '../../components/Table';

export default function TamVangList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res: any = await tamVangService.getAll();
        // Backend trả về: { message, data: { tamVangs: [...], count: X } }
        const tamVangList = res.data?.tamVangs || res.data || [];
        setRows(tamVangList);
      } catch (err) {
        console.error(err);
        setRows([]);
      }
    };
    loadData();
  }, []);

  const columns = [
    { field: 'MADANGKYTAMVANG', headerName: 'ID', width: 50 },
    { field: 'MANHANKHAU', headerName: 'Mã NK', width: 80 },
    { field: 'NOITAMTRU', headerName: 'Nơi Đến (Tạm trú)', width: 200 },
    { field: 'TUNGAY', headerName: 'Từ Ngày', width: 120 },
    { field: 'DENNGAY', headerName: 'Đến Ngày', width: 120 },
    { field: 'LYDO', headerName: 'Lý Do', width: 200 },
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