# PHÂN TÍCH LOGIC CHỦ HỘ VÀ PHƯƠNG ÁN QUẢN LÝ

## 📊 CẤU TRÚC DỮ LIỆU

### Bảng HOKHAU
```
MAHOKHAU (PK)    - ID hộ khẩu
IDCHUHO          - ID nhân khẩu làm chủ hộ (nullable, FK → NHANKHAU.MANHANKHAU)
MAPHONG          - Mã phòng (bắt buộc)
LOAICANHO        - Loại căn hộ (bắt buộc, FK → PHICODINH.LOAICANHO)
XEMAY, OTO       - Số xe (optional)
DIACHI, GHICHU   - Thông tin bổ sung
ACTIVATE         - Trạng thái
```

### Bảng NHANKHAU
```
MANHANKHAU (PK)  - ID nhân khẩu
MAHOKHAU         - Hộ khẩu mà nhân khẩu này thuộc về (nullable, FK → HOKHAU.MAHOKHAU)
HOTEN            - Họ tên
QUANHEVOICHUHO   - Quan hệ với chủ hộ (VD: "Chủ hộ", "Con", "Vợ/Chồng")
ACTIVATE         - Trạng thái
```

## 🔗 QUAN HỆ GIỮA HỘ KHẨU VÀ NHÂN KHẨU

### Hai mối quan hệ:
1. **HOKHAU → NHANKHAU (qua IDCHUHO)**
   - Một hộ khẩu có **0 hoặc 1 chủ hộ**
   - Một nhân khẩu có thể là **chủ hộ của nhiều hộ khẩu** (trường hợp hiếm, nhưng schema cho phép)

2. **NHANKHAU → HOKHAU (qua MAHOKHAU)**
   - Một nhân khẩu thuộc về **0 hoặc 1 hộ khẩu**
   - Một hộ khẩu có **nhiều nhân khẩu**

## ⚠️ VẤN ĐỀ CẦN LƯU Ý

### Trường hợp bất thường:
```
NHÂN KHẨU A:
  - MANHANKHAU = 1
  - MAHOKHAU = 100 (thuộc hộ 100)

HỘ KHẨU 200:
  - MAHOKHAU = 200
  - IDCHUHO = 1 (chủ hộ là nhân khẩu A)

→ Nhân khẩu A đang Ở HỘ 100 nhưng làm CHỦ HỘ của HỘ 200
```

### Các ràng buộc logic:
1. ✅ **Chủ hộ nên thuộc chính hộ đó**: `IDCHUHO` của hộ X nên là nhân khẩu có `MAHOKHAU = X`
2. ✅ **Chủ hộ phải ACTIVATE=true**
3. ✅ **Không thể xóa nhân khẩu đang làm chủ hộ** (đã implement)

## 💡 PHƯƠNG ÁN QUẢN LÝ CHỦ HỘ

### A. KHI TẠO HỘ KHẨU MỚI

#### Phương án 1: **Tạo hộ trống, thêm chủ hộ sau** ✅ KHUYẾN NGHỊ
```
Bước 1: Tạo hộ khẩu
  - MAPHONG: "P101"
  - LOAICANHO: "A"
  - IDCHUHO: null (chưa có chủ hộ)

Bước 2: Thêm nhân khẩu vào hộ
  - Tạo nhân khẩu với MAHOKHAU = hộ vừa tạo
  - QUANHEVOICHUHO = "Chủ hộ"

Bước 3: Gán chủ hộ cho hộ khẩu
  - Update HOKHAU.IDCHUHO = ID nhân khẩu vừa tạo
```

**Ưu điểm:**
- Linh hoạt, không ràng buộc phải có chủ hộ ngay
- Đảm bảo chủ hộ thuộc chính hộ đó
- Phù hợp thực tế (tạo hộ trước, đăng ký người sau)

**Nhược điểm:**
- Phải thao tác 3 bước

#### Phương án 2: **Tạo hộ + chủ hộ cùng lúc**
```
Request:
{
  "MAPHONG": "P101",
  "LOAICANHO": "A",
  "chuHo": {
    "HOTEN": "Nguyễn Văn A",
    "SOCANCUOC": "001234567890"
    // ... thông tin chủ hộ
  }
}

Backend tự động:
1. Tạo hộ khẩu (IDCHUHO = null tạm thời)
2. Tạo nhân khẩu với MAHOKHAU = hộ vừa tạo
3. Update HOKHAU.IDCHUHO = ID nhân khẩu vừa tạo
```

**Ưu điểm:**
- UX tốt hơn, chỉ 1 form
- Đảm bảo ràng buộc logic

**Nhược điểm:**
- Code phức tạp hơn (transaction)
- Khó xử lý lỗi giữa chừng

### B. CHỈNH SỬA CHỦ HỘ

#### Trường hợp 1: **Thêm chủ hộ cho hộ chưa có chủ**
```
1. Kiểm tra hộ khẩu chưa có IDCHUHO (= null)
2. Chọn nhân khẩu có MAHOKHAU = hộ này
3. Update HOKHAU.IDCHUHO = nhân khẩu đã chọn
4. Update NHANKHAU.QUANHEVOICHUHO = "Chủ hộ"
```

#### Trường hợp 2: **Thay đổi chủ hộ** ⚠️ PHỨC TẠP
```
Tình huống: Hộ có chủ là A, muốn đổi sang B

Option 2.1: CHỈ CHO PHÉP THAY ĐỔI NẾU B THUỘC CÙNG HỘ ✅ AN TOÀN
1. Kiểm tra B.MAHOKHAU = hộ hiện tại
2. Update HOKHAU.IDCHUHO = B
3. Update A.QUANHEVOICHUHO = "Con" (hoặc quan hệ khác)
4. Update B.QUANHEVOICHUHO = "Chủ hộ"

Option 2.2: CHO PHÉP THAY ĐỔI BẤT KỲ AI ⚠️ RỦI RO
1. Tạo lịch sử cư trú cho A (nếu A.MAHOKHAU = hộ này)
2. Xóa A khỏi hộ (A.MAHOKHAU = null hoặc ACTIVATE=false)
3. Nếu B chưa thuộc hộ: Update B.MAHOKHAU = hộ này
4. Update HOKHAU.IDCHUHO = B
5. Update B.QUANHEVOICHUHO = "Chủ hộ"
```

#### Trường hợp 3: **Xóa chủ hộ**
```
1. Update HOKHAU.IDCHUHO = null
2. Update NHANKHAU.QUANHEVOICHUHO = "Thành viên" (nếu còn ở hộ)
```

### C. XÓA HỘ KHẨU

```
Kiểm tra:
1. Có nhân khẩu nào đang ở hộ không? (NHANKHAU.MAHOKHAU = hộ này)
   - Nếu có: Yêu cầu xóa/chuyển hết nhân khẩu trước
2. Có hóa đơn/phí nào chưa thanh toán không?
   - Nếu có: Cảnh báo

Thực hiện:
1. Soft delete: Update ACTIVATE = false, NGAYKETTHUC = now()
2. Tạo lịch sử cư trú cho tất cả nhân khẩu trong hộ
```

## 🎯 KHUYẾN NGHỊ IMPLEMENTATION

### 1. API ENDPOINTS

```
POST   /ho-khau                    - Tạo hộ mới (MAPHONG, LOAICANHO bắt buộc, IDCHUHO optional)
GET    /ho-khau                    - Lấy danh sách hộ (có include chủ hộ, nhân khẩu)
GET    /ho-khau/:id                - Lấy chi tiết 1 hộ
PUT    /ho-khau/:id                - Cập nhật thông tin hộ (XEMAY, OTO, DIACHI...)
DELETE /ho-khau/:id                - Xóa hộ (soft delete)

PUT    /ho-khau/:id/chu-ho         - CHUYÊN dành cho thay đổi chủ hộ
POST   /ho-khau/:id/them-thanh-vien - Thêm nhân khẩu vào hộ
```

### 2. BUSINESS RULES

```javascript
// Rule 1: Chỉ cho phép chủ hộ thuộc chính hộ đó
if (newChuHo.MAHOKHAU !== hoKhau.MAHOKHAU) {
  throw new Error("Chủ hộ phải là thành viên của hộ này");
}

// Rule 2: Chủ hộ phải active
if (!newChuHo.ACTIVATE) {
  throw new Error("Không thể gán người không hoạt động làm chủ hộ");
}

// Rule 3: Tự động update quan hệ
- Chủ hộ cũ: QUANHEVOICHUHO = "Thành viên"
- Chủ hộ mới: QUANHEVOICHUHO = "Chủ hộ"
```

### 3. FRONTEND UX

```
Form Thêm Hộ Khẩu:
├─ Mã phòng *
├─ Loại căn hộ * (dropdown từ PHICODINH)
├─ Số xe máy
├─ Số ô tô
├─ Địa chỉ
├─ Ghi chú
└─ [Checkbox] Thêm chủ hộ ngay
    └─ Nếu check: Hiện form chọn/tạo nhân khẩu

Form Sửa Hộ Khẩu:
├─ Tab "Thông tin cơ bản"
├─ Tab "Chủ hộ" 
│   ├─ Hiển thị chủ hộ hiện tại (nếu có)
│   ├─ [Button] Thay đổi chủ hộ
│   │   └─ Dropdown: Chỉ hiện nhân khẩu thuộc hộ này
│   └─ [Button] Xóa chủ hộ
└─ Tab "Thành viên"
    └─ Danh sách nhân khẩu trong hộ
```

## 📋 CHECKLIST IMPLEMENTATION

- [ ] API tạo hộ khẩu (IDCHUHO optional)
- [ ] API lấy danh sách PHICODINH (dropdown loại căn hộ)
- [ ] API PUT /ho-khau/:id/chu-ho (chuyên xử lý thay đổi chủ hộ)
- [ ] Frontend: Form tạo hộ với dropdown LOAICANHO
- [ ] Frontend: Form sửa với Tab "Chủ hộ"
- [ ] Frontend: Dropdown chọn chủ hộ (chỉ nhân khẩu trong hộ)
- [ ] Validation: Chủ hộ phải thuộc hộ
- [ ] Auto-update QUANHEVOICHUHO khi thay chủ hộ
- [ ] Kiểm tra constraint khi xóa hộ
