#!/bin/bash

# Script test API quản lý dân cư (NHANKHAU)
# Cần đăng nhập trước để có cookie accessToken

BASE_URL="http://localhost:8080"
COOKIE_FILE="cookies.txt"

echo "========================================="
echo "TEST API QUẢN LÝ DÂN CƯ (NHANKHAU)"
echo "========================================="

# Đăng nhập để lấy cookie
echo -e "\n1️⃣  ĐĂNG NHẬP"
curl -c $COOKIE_FILE -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "123456"
  }'

echo -e "\n\n========================================="
echo "2️⃣  TẠO DÂN CƯ MỚI (Chỉ bắt buộc HOTEN)"
echo "========================================="
curl -b $COOKIE_FILE -X POST "$BASE_URL/nhan-khau" \
  -H "Content-Type: application/json" \
  -d '{
    "HOTEN": "Nguyễn Văn Test",
    "SOCANCUOC": "001234567890",
    "NGAYSINH": "1990-05-15",
    "GIOITINH": "Nam",
    "NOISINH": "Hà Nội",
    "DANTOC": "Kinh",
    "QUOCTICH": "Việt Nam",
    "NGHENGHIEP": "Kỹ sư phần mềm",
    "GHICHU": "Nhân khẩu test"
  }'

echo -e "\n\n========================================="
echo "3️⃣  TẠO DÂN CƯ MỚI (Chỉ có HOTEN - tối thiểu)"
echo "========================================="
curl -b $COOKIE_FILE -X POST "$BASE_URL/nhan-khau" \
  -H "Content-Type: application/json" \
  -d '{
    "HOTEN": "Trần Thị Minimal"
  }'

echo -e "\n\n========================================="
echo "4️⃣  LẤY TẤT CẢ DÂN CƯ (Có thông tin hộ khẩu)"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau?include"

echo -e "\n\n========================================="
echo "5️⃣  LẤY DÂN CƯ ĐANG HOẠT ĐỘNG"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau?ACTIVATE=true&include"

echo -e "\n\n========================================="
echo "6️⃣  TÌM KIẾM DÂN CƯ THEO HỌ TÊN (contains)"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau?HOTEN=Nguyễn&include"

echo -e "\n\n========================================="
echo "7️⃣  TÌM KIẾM DÂN CƯ THEO SỐ CĂN CƯỚC"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau?SOCANCUOC=001234567890&include"

echo -e "\n\n========================================="
echo "8️⃣  TÌM KIẾM DÂN CƯ THEO NGÀY SINH"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau?NGAYSINH=1990-05-15&include"

echo -e "\n\n========================================="
echo "9️⃣  LẤY THÔNG TIN 1 DÂN CƯ (ID=1)"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau/1?include"

echo -e "\n\n========================================="
echo "🔟  CẬP NHẬT THÔNG TIN DÂN CƯ (ID=1)"
echo "========================================="
curl -b $COOKIE_FILE -X PUT "$BASE_URL/nhan-khau/1" \
  -H "Content-Type: application/json" \
  -d '{
    "HOTEN": "Nguyễn Văn Updated",
    "NGHENGHIEP": "Giám đốc",
    "GHICHU": "Đã cập nhật thông tin"
  }'

echo -e "\n\n========================================="
echo "1️⃣1️⃣  XÓA DÂN CƯ (ID=2 - Không phải chủ hộ)"
echo "========================================="
curl -b $COOKIE_FILE -X DELETE "$BASE_URL/nhan-khau/2"

echo -e "\n\n========================================="
echo "1️⃣2️⃣  THỬ XÓA DÂN CƯ LÀ CHỦ HỘ (Sẽ fail)"
echo "========================================="
echo "Trước tiên tạo hộ khẩu với chủ hộ ID=1:"
curl -b $COOKIE_FILE -X POST "$BASE_URL/ho-khau" \
  -H "Content-Type: application/json" \
  -d '{
    "IDCHUHO": 1,
    "MAPHONG": "P101",
    "LOAICANHO": "A"
  }'

echo -e "\n\nBây giờ thử xóa nhân khẩu ID=1 (đang là chủ hộ):"
curl -b $COOKIE_FILE -X DELETE "$BASE_URL/nhan-khau/1"

echo -e "\n\n========================================="
echo "1️⃣3️⃣  PHÂN TRANG (Page 1, Limit 5)"
echo "========================================="
curl -b $COOKIE_FILE -X GET "$BASE_URL/nhan-khau?page=1&limit=5&include"

echo -e "\n\n========================================="
echo "✅ HOÀN THÀNH TEST API QUẢN LÝ DÂN CƯ"
echo "========================================="

# Cleanup
rm -f $COOKIE_FILE
