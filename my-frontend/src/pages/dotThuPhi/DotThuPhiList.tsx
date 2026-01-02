import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dotThuPhiService } from '../../api/dotThuPhi.service';
import Table from '../../components/Table';

export default function DotThuPhiList() {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    try {
      const res: any = await dotThuPhiService.getAll();
      // Backend trả về: { dotThuPhi: { dotThuPhis: [...], count: X } }
      const dotThuPhiList = res.dotThuPhi?.dotThuPhis || res.dotThuPhi || [];
      setRows(dotThuPhiList);
    } catch (err) { 
      console.error(err); 
      setRows([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: any) => {
    if(confirm('Xóa đợt thu này? (Cẩn thận nếu đã có người đóng tiền)')) {
        await dotThuPhiService.delete(id);
        loadData();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'ten', headerName: 'Tên Đợt Thu', width: 250 },
    { field: 'batBuoc', headerName: 'Loại', width: 120 }, // Backend trả về 1/0, ta hiển thị text sau
    { field: 'ngayTao', headerName: 'Ngày Tạo', width: 150 },
    { field: 'moTa', headerName: 'Mô Tả', width: 300 },
  ];

  // Hàm custom để hiển thị Bắt buộc/Tự nguyện thay vì 1/0
  const processedRows = rows.map((r: any) => ({
      ...r,
      BATBUOC: r.BATBUOC ? 'Bắt buộc' : 'Tự nguyện' // Boolean: true/false
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2>Quản Lý Đợt Thu Phí</h2>
        <Link to="/dot-thu-phi/create">
            <button style={{ padding: 10, background: 'green', color: 'white' }}>+ Tạo Đợt Thu Mới</button>
        </Link>
      </div>
      <Table 
        columns={columns} rows={processedRows} 
        onEdit={(id) => window.location.href = `/dot-thu-phi/edit/${id}`} 
        onDelete={handleDelete}
      />
    </div>
  );
}