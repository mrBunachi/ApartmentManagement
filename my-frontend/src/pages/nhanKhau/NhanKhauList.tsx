import { useEffect, useState } from "react";
import Table from "../../components/Table";
import nhanKhauService from "../../api/nhanKhau.service";


export default function NhanKhauList() {
  const [rows, setRows] = useState([]);
  const load = async () => {
    const res = await nhanKhauService.getAll();
    setRows(res.data);
  };
  useEffect(() => { load(); }, []);


  return (
    <div>
      <h2>Nhân khẩu</h2>
      <Table columns={[{ field: "hoten", headerName: "Họ tên", width: 200 }]} rows={rows} />
    </div>
  );
}