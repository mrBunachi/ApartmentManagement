# HƯỚNG DẪN CHẠY DỰ ÁN QUẢN LÝ CHUNG CƯ

## 📋 YÊU CẦU HỆ THỐNG
- Node.js >= 16.x
- PostgreSQL hoặc MySQL
- npm hoặc yarn

## 🚀 CÁCH CHẠY DỰ ÁN

### 1. CHẠY BACKEND (Port 3000)

```bash
cd /home/lam/on_class/nmcnpmPrj/ApartmentManagement/be

# Cài đặt dependencies (lần đầu tiên)
npm install

# Tạo file .env với nội dung sau:
# DATABASE_URL="postgresql://user:password@localhost:5432/apartment_db"
# JWT_SECRET="your-secret-key-here"
# JWT_REFRESH_SECRET="your-refresh-secret-here"
# FRONT_URI="http://localhost:5173"

# Chạy Prisma migration
npx prisma migrate dev

# Chạy server (development mode)
npm run dev
# HOẶC chạy production:
npm start
```

Backend sẽ chạy tại: **http://localhost:3000**

### 2. CHẠY FRONTEND (Port 5173)

```bash
cd /home/lam/on_class/nmcnpmPrj/ApartmentManagement/my-frontend

# Cài đặt dependencies (lần đầu tiên)
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## 🔧 CÁC THAY ĐỔI ĐÃ GHÉP API

### ✅ Đã hoàn thành:
1. **Login thật** - Gọi API `/auth/login` với cookie-based authentication
2. **Request handler** - Axios interceptor tự động gửi cookies (`withCredentials: true`)
3. **Response format** - Tất cả services đã match với backend response:
   - Nhân khẩu: `{ message, residents: {...} }`
   - Hộ khẩu: `{ message, apartments: {...} }`
   - Đợt thu phí: `{ dotThuPhi: {...} }`
   - Đóng góp: `{ message, data: [...], pagination }`
   - Tạm trú/vắng: `{ message, data: {...} }`

4. **All List pages** - Xử lý đúng pagination và nested response
5. **All Form pages** - Create/Update/Load detail khớp với API
6. **Logout** - Gọi API `/auth/logout` để xóa httpOnly cookies

---

## 📝 API ENDPOINTS ĐANG SỬ DỤNG

### Authentication
- `POST /auth/login` - Đăng nhập (trả về cookies)
- `POST /auth/logout` - Đăng xuất
- `POST /auth/register` - Đăng ký admin mới

### Nhân Khẩu (Residents)
- `GET /nhan-khau` - Danh sách cư dân
- `GET /nhan-khau/:id` - Chi tiết 1 cư dân
- `POST /nhan-khau` - Thêm cư dân
- `PUT /nhan-khau/:id` - Cập nhật
- `DELETE /nhan-khau/:id` - Xóa

### Hộ Khẩu (Apartments)
- `GET /ho-khau` - Danh sách căn hộ
- `GET /ho-khau/:id` - Chi tiết
- `POST /ho-khau` - Thêm căn hộ
- `PUT /ho-khau/:id` - Cập nhật
- `DELETE /ho-khau/:id` - Xóa

### Đợt Thu Phí
- `GET /dot-thu-phi` - Danh sách đợt thu
- `GET /dot-thu-phi/:id` - Chi tiết
- `POST /dot-thu-phi` - Tạo đợt thu mới
- `PUT /dot-thu-phi/:id` - Cập nhật
- `DELETE /dot-thu-phi/:id` - Xóa

### Đóng Góp
- `GET /dong-gop` - Lịch sử đóng góp
- `GET /dong-gop/:id` - Chi tiết
- `POST /dong-gop` - Ghi nhận đóng tiền
- `PUT /dong-gop/:id` - Cập nhật
- `DELETE /dong-gop/:id` - Xóa lịch sử

### Tạm Trú/Tạm Vắng
- `GET /tam-tru`, `GET /tam-vang` - Danh sách
- `POST /tam-tru`, `POST /tam-vang` - Đăng ký mới
- `PUT /tam-tru/:id`, `PUT /tam-vang/:id` - Cập nhật
- `DELETE /tam-tru/:id`, `DELETE /tam-vang/:id` - Xóa

---

## 🔐 AUTHENTICATION

Backend dùng **httpOnly cookies**, không dùng Bearer token trong header.

**Quan trọng**: Mọi request phải có `withCredentials: true` để gửi cookies.

Đã config sẵn trong `utils/request.ts`:
```typescript
const request = axios.create({ 
  baseURL: API_URL,
  withCredentials: true // ← Quan trọng!
});
```

---

## 🐛 TROUBLESHOOTING

### Lỗi CORS
Kiểm tra backend `.env`:
```
FRONT_URI="http://localhost:5173"
```

### Lỗi 401 Unauthorized
1. Kiểm tra đã đăng nhập chưa
2. Clear cookies trình duyệt
3. Kiểm tra backend cookies settings trong `authController.js`:
   - `secure: true` (cần HTTPS trong production)
   - `sameSite: "None"` 

### Database connection failed
Kiểm tra:
1. PostgreSQL/MySQL đã chạy chưa
2. `DATABASE_URL` trong `.env` đúng chưa
3. Chạy `npx prisma migrate dev` để tạo tables

---

## 📦 CẤU TRÚC DỰ ÁN

```
ApartmentManagement/
├── be/                    # Backend (Express + Prisma)
│   ├── controllers/       # API controllers
│   ├── services/          # Business logic
│   ├── routes/            # Route definitions
│   ├── middleware/        # Auth middleware
│   └── prisma/            # Database schema
│
└── my-frontend/           # Frontend (React + TypeScript)
    ├── src/
    │   ├── api/           # API service files
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── context/       # React Context (Auth)
    │   ├── hooks/         # Custom hooks
    │   └── utils/         # Utilities (request, constants)
    └── ...
```

---

## 👤 ĐĂNG NHẬP TEST

Tạo user test bằng API:
```bash
POST http://localhost:3000/auth/register
{
  "user": "admin",
  "name": "Admin Test",
  "password": "123456",
  "phone_number": "0123456789",
  "role": "admin_1"
}
```

Sau đó đăng nhập với:
- **Username/Email**: `admin`
- **Password**: `123456`

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, kiểm tra:
1. Console browser (F12) - Xem lỗi frontend
2. Terminal backend - Xem lỗi server
3. Network tab - Xem request/response API
