# QUY TRÌNH HOẠT ĐỘNG BACKEND - QUẢN LÝ CHUNG CƯ

## 📊 CẤU TRÚC DATABASE (Thứ tự quan trọng)

```
1. NGUOIQUANLY (Quản lý - độc lập)
2. PHICODINH (Phí cố định theo loại căn hộ)
3. HOKHAU (Hộ khẩu - cần PHICODINH)
4. NHANKHAU (Nhân khẩu - cần HOKHAU)
5. DOTTHUPHI (Đợt thu phí - cần NGUOIQUANLY)
6. LOAIPHI (Loại phí đóng góp)
7. DONGGOP (Đóng góp - cần DOTTHUPHI, HOKHAU, LOAIPHI)
8. DANHSACHTHUPHI (Danh sách thu - cần DOTTHUPHI, HOKHAU)
9. PHITHUHO (Phí thu hộ - cần DOTTHUPHI, HOKHAU)
10. TAMTRU, TAMVANG (Tạm trú/vắng - cần NHANKHAU)
11. LICHSU_CUTRU (Lịch sử - cần NHANKHAU, HOKHAU)
```

---

## 🔄 QUY TRÌNH THÊM/SỬA/XÓA

### ✅ THÊM HỘ KHẨU MỚI

**Bước 1: Đảm bảo có Loại Căn Hộ trong PHICODINH**
```json
POST /phi-co-dinh
{
  "LOAICANHO": "Cao cấp",
  "GIATIENCANHO": 5000000,
  "PHIQLCHUNGCU": 200000,
  "PHIXEMAY": 50000,
  "PHIXEOTO": 300000
}
```

**Bước 2: Tạo Hộ Khẩu**
```json
POST /ho-khau
{
  "MAPHONG": "A101",
  "LOAICANHO": "Cao cấp",  // ← PHẢI tồn tại trong PHICODINH
  "DIACHI": "Tầng 1, Block A",
  "XEMAY": 2,
  "OTO": 1
}
```
⚠️ **Lưu ý**: `LOAICANHO` phải match với `LOAICANHO` trong bảng PHICODINH (Foreign Key)

**Bước 3: Thêm Nhân Khẩu vào Hộ**
```json
POST /nhan-khau
{
  "MAHOKHAU": 1,  // ← ID hộ khẩu vừa tạo
  "HOTEN": "Nguyễn Văn A",
  "SOCANCUOC": "001234567890",
  "NGAYSINH": "1990-01-01",
  "GIOITINH": "Nam",
  "QUANHEVOICHUHO": "Chủ hộ"
}
```

**Bước 4: Cập nhật Chủ Hộ cho HOKHAU**
```json
PUT /ho-khau/1
{
  "IDCHUHO": 1  // ← ID nhân khẩu vừa tạo
}
```

---

### ✏️ SỬA HỘ KHẨU

**Sửa thông tin hộ:**
```json
PUT /ho-khau/:id
{
  "MAPHONG": "A102",
  "XEMAY": 3
}
```

**Sửa nhân khẩu:**
```json
PUT /nhan-khau/:id
{
  "HOTEN": "Nguyễn Văn B",
  "SODIENTHOAI": "0987654321"
}
```

---

### ❌ XÓA HỘ KHẨU

**⚠️ THỨ TỰ QUAN TRỌNG (tránh lỗi Foreign Key)**

**Cách 1: Xóa Soft (Khuyến nghị)**
```json
PUT /ho-khau/:id
{
  "ACTIVATE": false
}
```

**Cách 2: Xóa Hard (Xóa hẳn)**

Xóa theo thứ tự:
1. **Xóa Tạm trú/vắng của các thành viên**
   ```
   DELETE /tam-tru/:id
   DELETE /tam-vang/:id
   ```

2. **Xóa Lịch sử cư trú**
   ```
   DELETE /lich-su/:id
   ```

3. **Xóa Đóng góp**
   ```
   DELETE /dong-gop/:id
   ```

4. **Xóa Danh sách thu phí**
   ```
   DELETE /danh-sach-thu-phi/:id
   ```

5. **Xóa Nhân khẩu** (trừ chủ hộ)
   ```
   DELETE /nhan-khau/:id
   ```

6. **Xóa Chủ hộ** (set NULL trước)
   ```
   PUT /ho-khau/:id { "IDCHUHO": null }
   DELETE /nhan-khau/:chuho_id
   ```

7. **Xóa Hộ khẩu**
   ```
   DELETE /ho-khau/:id
   ```

**⚠️ LƯU Ý:** Với schema hiện tại, một số bảng có `onDelete: Cascade`, nên khi xóa hộ khẩu, các bản ghi con sẽ tự động xóa. Nhưng vẫn nên kiểm tra kỹ.

---

## 📋 QUY TRÌNH TẠO ĐỢT THU PHÍ

**Bước 1: Tạo Đợt Thu**
```json
POST /dot-thu-phi
{
  "TEN": "Thu phí quản lý tháng 1/2026",
  "BATBUOC": true,
  "MOTA": "Phí quản lý hàng tháng",
  "NGUOIQUANLYId": 1  // ← ID admin đang đăng nhập
}
```

**Bước 2: Tạo Danh Sách Thu Phí cho từng hộ**
```json
POST /danh-sach-thu-phi
{
  "MADOTTHU": 1,
  "MAHOKHAU": 1,
  "TIENNHA": 5000000,
  "TIENDICHVU": 200000,
  "TIENXEMAY": 100000,
  "TIENOTO": 300000,
  "TIENDIEN": 500000,
  "TIENNUOC": 150000
}
```

**Bước 3: Ghi nhận Đóng Góp khi cư dân trả tiền**
```json
POST /dong-gop
{
  "MADOTTHU": 1,
  "MAHOKHAU": 1,
  "SOTIENDADONG": 6250000,
  "TRANGTHAI": true,
  "NGAYDONG": "2026-01-15",
  "HINHTHUC": "Chuyển khoản"
}
```

---

## 🔐 QUY TRÌNH ĐĂNG NHẬP/ĐĂNG KÝ

**Đăng ký Admin:**
```json
POST /auth/register
{
  "user": "admin",
  "name": "Quản lý A",
  "password": "123456",
  "phone_number": "0123456789",
  "email": "admin@example.com",
  "role": "admin_1"
}
```

**Đăng nhập:**
```json
POST /auth/login
{
  "identifier": "admin",  // Username hoặc email
  "password": "123456"
}
```
→ Trả về **httpOnly cookies** (không có token trong response)

---

## 🔗 QUAN HỆ GIỮA CÁC BẢNG (Foreign Keys)

```
HOKHAU
├─ LOAICANHO → PHICODINH.LOAICANHO (CASCADE)
└─ IDCHUHO → NHANKHAU.MANHANKHAU (CASCADE)

NHANKHAU
└─ MAHOKHAU → HOKHAU.MAHOKHAU (RESTRICT - không xóa được hộ nếu còn người)

DOTTHUPHI
└─ NGUOIQUANLYId → NGUOIQUANLY.id (RESTRICT)

DONGGOP
├─ MADOTTHU → DOTTHUPHI.MADOTTHU (CASCADE)
├─ MAHOKHAU → HOKHAU.MAHOKHAU (RESTRICT)
└─ MALOAIPHI → LOAIPHI.MALOAIPHI (CASCADE)

DANHSACHTHUPHI
├─ MADOTTHU → DOTTHUPHI.MADOTTHU (CASCADE)
└─ MAHOKHAU → HOKHAU.MAHOKHAU (RESTRICT)

TAMTRU/TAMVANG
└─ MANHANKHAU → NHANKHAU.MANHANKHAU (RESTRICT)
```

**Cascade**: Xóa cha → tự động xóa con  
**Restrict**: Không cho xóa cha nếu còn con

---

## ⚙️ SCRIPT SEED DATA

Xem file: `prisma/seed.js`

Chạy lệnh:
```bash
cd be
node prisma/seed.js
```

---

## 🐛 LỖI THƯỜNG GẶP

### 1. Foreign Key Constraint Failed
```
Foreign key constraint failed on the field: `LOAICANHO`
```
**Nguyên nhân**: Tạo hộ khẩu với `LOAICANHO` chưa tồn tại trong PHICODINH  
**Giải pháp**: Tạo PHICODINH trước

### 2. Cannot delete referenced record
```
The change you are trying to make would violate the required relation
```
**Nguyên nhân**: Xóa hộ khẩu nhưng còn nhân khẩu đang tham chiếu  
**Giải pháp**: Xóa nhân khẩu trước, hoặc dùng soft delete (ACTIVATE=false)

### 3. Unique constraint failed
```
Unique constraint failed on the fields: (`SOCANCUOC`)
```
**Nguyên nhân**: Số CCCD bị trùng  
**Giải pháp**: Kiểm tra CCCD trước khi tạo

---

## 📝 CHECKLIST TRƯỚC KHI THÊM MỚI

### Thêm Hộ Khẩu:
- [ ] Đã có PHICODINH với LOAICANHO tương ứng?
- [ ] MAPHONG có bị trùng không?

### Thêm Nhân Khẩu:
- [ ] MAHOKHAU đã tồn tại chưa?
- [ ] SOCANCUOC có bị trùng không?
- [ ] Nếu là chủ hộ, có update HOKHAU.IDCHUHO chưa?

### Tạo Đợt Thu:
- [ ] NGUOIQUANLYId có tồn tại không?
- [ ] Đã tạo danh sách thu cho các hộ chưa?

---

## 🎯 TÓM TẮT THỨ TỰ THAO TÁC

**Khởi tạo hệ thống:**
1. Đăng ký Admin
2. Tạo Phí cố định (PHICODINH)
3. Tạo Loại phí đóng góp (LOAIPHI)

**Thêm hộ mới:**
1. Tạo Hộ khẩu (HOKHAU)
2. Thêm Chủ hộ (NHANKHAU)
3. Update IDCHUHO cho hộ
4. Thêm các thành viên khác (NHANKHAU)

**Thu phí:**
1. Tạo Đợt thu (DOTTHUPHI)
2. Tạo Danh sách thu cho các hộ (DANHSACHTHUPHI)
3. Ghi nhận đóng tiền (DONGGOP)

**Xóa hộ:**
1. Soft delete (khuyến nghị): Set ACTIVATE=false
2. Hard delete: Xóa từ con lên cha (tạm trú → nhân khẩu → hộ)
