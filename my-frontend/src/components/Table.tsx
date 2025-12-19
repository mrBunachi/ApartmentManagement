import React from 'react';

interface TableProps {
  columns: { field: string; headerName: string; width?: number }[];
  rows: any[];
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
}

export default function Table({ columns, rows, onEdit, onDelete }: TableProps) {
  // BẢO VỆ: Nếu rows bị null hoặc undefined thì coi như là mảng rỗng để không bị lỗi trắng trang
  const safeRows = Array.isArray(rows) ? rows : [];

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
          {safeRows.length > 0 ? (
            safeRows.map((row, index) => (
              // Dùng index làm key dự phòng nếu row không có id (tránh lỗi key)
              <tr key={row.id || index}> 
                {columns.map((col) => (
                  <td key={`${row.id || index}-${col.field}`} style={{ padding: 10 }}>
                    {/* Kiểm tra nếu giá trị null/undefined thì hiện chuỗi rỗng */}
                    {row[col.field] !== null && row[col.field] !== undefined ? row[col.field].toString() : ''}
                  </td>
                ))}
                
                {(onEdit || onDelete) && (
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row.id)} 
                        style={{ marginRight: 5, cursor: 'pointer', background: '#ffc107', border: 'none', padding: '5px 10px' }}
                      >
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(row.id)}
                        style={{ color: 'white', background: '#dc3545', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
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
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ textAlign: 'center', padding: 20 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}