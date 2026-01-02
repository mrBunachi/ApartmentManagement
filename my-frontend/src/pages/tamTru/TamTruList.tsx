import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tamTruService } from '../../api/tamTru.service';
import Table from '../../components/Table';

export default function TamTruList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res: any = await tamTruService.getAll();
        // Backend trả về: { message, data: { tamTrus: [...], count: X } }
        const tamTruList = res.data?.tamTrus || res.data || [];
        setRows(tamTruList);
      } catch (err) {
        console.error(err);
        setRows([]);
      }
    };
    loadData();
  }, []);

  const columns = [
    { field: 'MADANGKYTAMTRU', headerName: 'ID ĐK', width: 60 },
    { field: 'MANHANKHAU', headerName: 'Mã NK', width: 80 },
    { field: 'SODIENTHOAINGUOIDANGKY', headerName: 'SĐT', width: 120 },
    { field: 'TUNGAY', headerName: 'Từ Ngày', width: 120 },
    { field: 'DENNGAY', headerName: 'Đến Ngày', width: 120 },
    { field: 'LYDO', headerName: 'Lý Do', width: 200 },
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