# Cây Thư Mục Dự Án Frontend

```
my-frontend/
├── public/                          # Thư mục tài nguyên tĩnh
├── src/
│   ├── api/                        # Các service API
│   │   ├── dongGop.service.ts      # Service quản lý đóng góp
│   │   ├── dotThuPhi.service.ts    # Service quản lý đợt thu phí
│   │   ├── hoKhau.service.ts       # Service quản lý hộ khẩu
│   │   ├── nhanKhau.service.ts     # Service quản lý nhân khẩu
│   │   ├── tamTru.service.ts       # Service quản lý tạm trú
│   │   └── tamVang.service.ts      # Service quản lý tạm vắng
│   │
│   ├── app/
│   │   └── App.tsx                 # Component chính của ứng dụng
│   │
│   ├── components/                 # Các component tái sử dụng
│   │   ├── ProtectedRouted.tsx     # Component bảo vệ route
│   │   ├── Table.tsx               # Component bảng
│   │   ├── form/                   # Các component form
│   │   │   ├── FormDate.tsx        # Input ngày tháng
│   │   │   ├── FormInput.tsx       # Input text
│   │   │   └── FormSelect.tsx      # Select dropdown
│   │   └── layout/                 # Các component layout
│   │       ├── AdminLayout.tsx     # Layout quản trị
│   │       ├── Sidebar.tsx         # Thanh sidebar
│   │       └── Topbar.tsx          # Thanh trên cùng
│   │
│   ├── context/                    # Context API
│   │   └── AuthContext.tsx         # Context xác thực
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts              # Hook xác thực
│   │   └── useForm.ts              # Hook quản lý form
│   │
│   ├── pages/                      # Các trang chính
│   │   ├── auth/
│   │   │   └── Login.tsx           # Trang đăng nhập
│   │   ├── dashboard/
│   │   │   └── DashboardHome.tsx   # Trang dashboard chính
│   │   ├── dongGop/
│   │   │   ├── DongGopForm.tsx     # Form thêm/sửa đóng góp
│   │   │   └── DongGopList.tsx     # Danh sách đóng góp
│   │   ├── dotThuPhi/
│   │   │   ├── DotThuPhiForm.tsx   # Form thêm/sửa đợt thu phí
│   │   │   └── DotThuPhiList.tsx   # Danh sách đợt thu phí
│   │   ├── hoKhau/
│   │   │   ├── HoKhauForm.tsx      # Form thêm/sửa hộ khẩu
│   │   │   └── HoKhauList.tsx      # Danh sách hộ khẩu
│   │   ├── nhanKhau/
│   │   │   ├── NhanKhauForm.tsx    # Form thêm/sửa nhân khẩu
│   │   │   └── NhanKhauList.tsx    # Danh sách nhân khẩu
│   │   ├── tamTru/
│   │   │   ├── TamTruForm.tsx      # Form thêm/sửa tạm trú
│   │   │   └── TamTruList.tsx      # Danh sách tạm trú
│   │   └── tamVang/
│   │       ├── TamVangForm.tsx     # Form thêm/sửa tạm vắng
│   │       └── TamVangList.tsx     # Danh sách tạm vắng
│   │
│   ├── router/
│   │   └── router.tsx              # Định nghĩa các route
│   │
│   ├── types/                      # Định nghĩa TypeScript types
│   │   ├── dongGop.ts              # Type đóng góp
│   │   ├── dotThuPhi.ts            # Type đợt thu phí
│   │   ├── hoKhau.ts               # Type hộ khẩu
│   │   ├── nhanKhau.ts             # Type nhân khẩu
│   │   ├── tamTru.ts               # Type tạm trú
│   │   └── tamVang.ts              # Type tạm vắng
│   │
│   └── utils/                      # Các hàm tiện ích
│       ├── constants.ts            # Hằng số
│       ├── format.ts               # Hàm format dữ liệu
│       └── request.ts              # Hàm gọi API
│
├── .gitignore                      # File git ignore
├── eslint.config.js                # Cấu hình ESLint
├── index.html                      # File HTML chính
├── main.tsx                        # Entry point
├── package.json                    # Phụ thuộc npm
├── README.md                       # Tài liệu dự án
├── tsconfig.json                   # Cấu hình TypeScript
├── tsconfig.app.json               # Cấu hình TypeScript cho app
├── tsconfig.node.json              # Cấu hình TypeScript cho Node
└── vite.config.ts                  # Cấu hình Vite
```

## Mô Tả Cấu Trúc

### Các Thư Mục Chính:

- **`src/api/`** - Chứa các service gọi API đến backend
- **`src/components/`** - Các component tái sử dụng (form, layout, etc.)
- **`src/pages/`** - Các trang chính theo chức năng (hộ khẩu, nhân khẩu, etc.)
- **`src/context/`** - Context API cho state quản lý (xác thực, etc.)
- **`src/hooks/`** - Custom hooks React
- **`src/types/`** - Định nghĩa kiểu dữ liệu TypeScript
- **`src/utils/`** - Hàm tiện ích dùng chung
- **`src/router/`** - Định nghĩa routing

### Chức Năng:

Dự án quản lý:
- 👥 **Nhân khẩu** - Quản lý thông tin cư dân
- 🏠 **Hộ khẩu** - Quản lý thông tin hộ gia đình
- 📍 **Tạm trú** - Quản lý tạm trú
- 🌍 **Tạm vắng** - Quản lý tạm vắng
- 💰 **Đợt thu phí** - Quản lý các đợt thu phí
- 💳 **Đóng góp** - Quản lý đóng góp
