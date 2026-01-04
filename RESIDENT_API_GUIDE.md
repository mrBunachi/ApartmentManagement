# Hướng dẫn Test API Quản lý Dân cư

## 1. Chạy Backend
```bash
cd be
npm run dev
```

## 2. Test API bằng curl script
```bash
cd be
chmod +x test-resident-api.sh
./test-resident-api.sh
```

## 3. Test Manual với curl

### Đăng nhập trước (lưu cookie)
```bash
curl -c cookies.txt -X POST "http://localhost:8080/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin", "password": "123456"}'
```

### Tạo dân cư mới (chỉ bắt buộc HOTEN)
```bash
curl -b cookies.txt -X POST "http://localhost:8080/nhan-khau" \
  -H "Content-Type: application/json" \
  -d '{
    "HOTEN": "Nguyễn Văn Test"
  }'
```

### Tạo dân cư với đầy đủ thông tin
```bash
curl -b cookies.txt -X POST "http://localhost:8080/nhan-khau" \
  -H "Content-Type: application/json" \
  -d '{
    "HOTEN": "Trần Thị B",
    "SOCANCUOC": "001234567891",
    "NGAYSINH": "1995-03-20",
    "GIOITINH": "Nữ",
    "NOISINH": "TP.HCM",
    "DANTOC": "Kinh",
    "QUOCTICH": "Việt Nam",
    "NGHENGHIEP": "Giáo viên"
  }'
```

### Lấy tất cả dân cư (kèm thông tin hộ khẩu)
```bash
curl -b cookies.txt "http://localhost:8080/nhan-khau?include"
```

### Lấy dân cư đang hoạt động
```bash
curl -b cookies.txt "http://localhost:8080/nhan-khau?ACTIVATE=true&include"
```

### Tìm kiếm theo họ tên (contains)
```bash
curl -b cookies.txt "http://localhost:8080/nhan-khau?HOTEN=Nguyễn&include"
```

### Tìm kiếm theo số căn cước
```bash
curl -b cookies.txt "http://localhost:8080/nhan-khau?SOCANCUOC=001234567890&include"
```

### Tìm kiếm theo ngày sinh
```bash
curl -b cookies.txt "http://localhost:8080/nhan-khau?NGAYSINH=1990-05-15&include"
```

### Lấy thông tin 1 dân cư
```bash
curl -b cookies.txt "http://localhost:8080/nhan-khau/1?include"
```

### Cập nhật thông tin dân cư
```bash
curl -b cookies.txt -X PUT "http://localhost:8080/nhan-khau/1" \
  -H "Content-Type: application/json" \
  -d '{
    "HOTEN": "Nguyễn Văn Updated",
    "NGHENGHIEP": "Giám đốc"
  }'
```

### Xóa dân cư (soft delete)
```bash
curl -b cookies.txt -X DELETE "http://localhost:8080/nhan-khau/2"
```

### Test xóa dân cư đang là chủ hộ (sẽ bị lỗi)
```bash
# Tạo hộ khẩu với chủ hộ ID=1
curl -b cookies.txt -X POST "http://localhost:8080/ho-khau" \
  -H "Content-Type: application/json" \
  -d '{
    "IDCHUHO": 1,
    "MAPHONG": "P101",
    "LOAICANHO": "A"
  }'

# Thử xóa - sẽ fail với message: "Không thể xóa công dân này vì đang là Chủ hộ..."
curl -b cookies.txt -X DELETE "http://localhost:8080/nhan-khau/1"
```

## 4. Chạy Frontend

```bash
cd frontend
npm run dev
```

Truy cập: http://localhost:5173
- Đăng nhập: admin/123456
- Click menu "Quản lý Dân cư"

## Tính năng Frontend

- ✅ Hiển thị danh sách dân cư kèm thông tin hộ khẩu
- ✅ Tìm kiếm theo: Họ tên / Số căn cước / Ngày sinh
- ✅ Thêm dân cư mới (chỉ bắt buộc Họ tên)
- ✅ Sửa thông tin dân cư
- ✅ Xóa dân cư (check xem có là chủ hộ không)
- ✅ Console log tất cả request/response

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /nhan-khau?include | Lấy tất cả dân cư kèm thông tin hộ khẩu |
| GET | /nhan-khau/:id?include | Lấy thông tin 1 dân cư |
| GET | /nhan-khau?HOTEN=xxx | Tìm theo họ tên (contains) |
| GET | /nhan-khau?SOCANCUOC=xxx | Tìm theo số căn cước |
| GET | /nhan-khau?NGAYSINH=yyyy-mm-dd | Tìm theo ngày sinh |
| POST | /nhan-khau | Tạo dân cư mới (chỉ bắt buộc HOTEN) |
| PUT | /nhan-khau/:id | Cập nhật thông tin dân cư |
| DELETE | /nhan-khau/:id | Xóa dân cư (soft delete) |

## Validation

- ✅ Chỉ bắt buộc HOTEN khi tạo mới
- ✅ Tất cả field khác là optional
- ✅ Không thể xóa dân cư đang là chủ hộ
- ✅ SOCANCUOC phải unique (nếu có)
