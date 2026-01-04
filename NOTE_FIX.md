// chinh port fe
// them CORS
// Database schema cần DIRECT_URL để kết nối. Thử đổi sang DIRECT_URL hoặc kiểm tra Supabase:




///////////////////////////
doc trong prisma/seed 
dung mk: admin / 123456
{
    "message": "Tìm user thành công",
    "users": {
        "users": [
            {
                "id": 5,
                "TENDANGNHAP": "admin",
                "HOTEN": "Nguyễn Văn Admin Updated",
                "MATKHAU": "$2b$10$gQjr6Dnxf4HJEApp3H.o3OMX9Svv4XIG9i37R3jz0PRhnjAk3TdeK",
                "SODIENTHOAI": "0123456789",
                "EMAIL": "admin@apartment.com",
                "VAITRO": "admin_1",
                "ACTIVATE": true
            },
            {
                "id": 6,
                "TENDANGNHAP": "banquanly1",
                "HOTEN": "Trần Thị Quản Lý",
                "MATKHAU": "$2b$10$gQjr6Dnxf4HJEApp3H.o3OMX9Svv4XIG9i37R3jz0PRhnjAk3TdeK",
                "SODIENTHOAI": "0987654321",
                "EMAIL": "banquanly@apartment.com",
                "VAITRO": "admin_2",
                "ACTIVATE": true
            },
            {
                "id": 13,
                "TENDANGNHAP": "admingg",
                "HOTEN": "Hung Luu wre111",
                "MATKHAU": "1234",
                "SODIENTHOAI": "13ee412",
                "EMAIL": "admin@email.com",
                "VAITRO": "admin_1",
                "ACTIVATE": true
            },
            {
                "id": 15,
                "TENDANGNHAP": "admin003",
                "HOTEN": "Hung Luu 1188",
                "MATKHAU": "1234",
                "SODIENTHOAI": "789",
                "EMAIL": "admin002@gmail.com",
                "VAITRO": "admin_1",
                "ACTIVATE": true
            }
        ],
        "count": 4
    }
}