import { DataGrid } from "@mui/x-data-grid";


export default function Table({ columns, rows, loading, onEdit, onDelete }) {
  const actionCol = {
    field: "actions",
    headerName: "Thao tác",
    width: 150,
    renderCell: (params) => (
      <>
        <button onClick={() => onEdit(params.row)}>Sửa</button>
        <button onClick={() => onDelete(params.row)}>Xóa</button>
      </>
    ),
  };


  return (
    <DataGrid
      rows={rows}
      columns={[...columns, actionCol]}
      loading={loading}
      autoHeight
      pageSizeOptions={[5, 10, 20]}
    />
  );
}