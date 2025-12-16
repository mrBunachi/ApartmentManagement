import React from 'react';

// Định nghĩa Props đơn giản để TypeScript không báo lỗi
interface TableProps {
  columns: { field: string; headerName: string; width?: number }[];
  rows: any[];
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
}

export default function Table({ columns, rows, onEdit, onDelete }: TableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            {columns.map((col) => (
              <th key={col.field} style={{ padding: 10 }}>{col.headerName}</th>
            ))}
            {(onEdit || onDelete) && <th style={{ padding: 10 }}>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={`${row.id}-${col.field}`} style={{ padding: 10 }}>
                    {row[col.field]}
                  </td>
                ))}
                
                {(onEdit || onDelete) && (
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row.id)} 
                        style={{ marginRight: 5, cursor: 'pointer' }}
                      >
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(row.id)}
                        style={{ color: 'red', cursor: 'pointer' }}
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 20 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}