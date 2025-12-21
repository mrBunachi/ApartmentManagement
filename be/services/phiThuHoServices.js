const { prisma } = require("../config/database");

// Cấu hình đơn giá (Hardcode tạm thời, sau này có thể tách ra bảng riêng)
const DON_GIA = {
    DIEN: 3000,      // 3000 VNĐ / số
    NUOC: 20000,     // 20000 VNĐ / khối
    INTERNET: 250000 // Cố định
};

const phiThuHoDataParse = (data) => {
  try {
    const parsed = { ...data };

    // Parse số nguyên ID
    if ("MADOTTHU" in parsed) parsed.MADOTTHU = parseInt(parsed.MADOTTHU, 10);
    if ("MAHOKHAU" in parsed) parsed.MAHOKHAU = parseInt(parsed.MAHOKHAU, 10);

    // Parse các chỉ số (Decimal/Float)
    if ("TONGDIEN" in parsed) parsed.TONGDIEN = parseFloat(parsed.TONGDIEN); // Số điện tiêu thụ
    if ("TONGNUOC" in parsed) parsed.TONGNUOC = parseFloat(parsed.TONGNUOC); // Số nước tiêu thụ
    if ("THANHTIENINTERNET" in parsed) parsed.THANHTIENINTERNET = parseFloat(parsed.THANHTIENINTERNET);

    // --- LOGIC TÍNH TIỀN TỰ ĐỘNG ---
    // Nếu có số điện -> Tính tiền điện
    if (parsed.TONGDIEN !== undefined && parsed.TONGDIEN >= 0) {
        parsed.TONGTIENDIEN = parsed.TONGDIEN * DON_GIA.DIEN;
    }
    // Nếu có số nước -> Tính tiền nước
    if (parsed.TONGNUOC !== undefined && parsed.TONGNUOC >= 0) {
        parsed.THANHTIENNUOC = parsed.TONGNUOC * DON_GIA.NUOC; // Lưu ý: Schema của bạn tên là THANHTIENNUOC hay TONGTIENNUOC? Check lại schema nhé. Tôi dùng THANHTIENNUOC theo schema gửi ban đầu.
    }
    
    // Nếu Internet không nhập thì mặc định
    if (parsed.THANHTIENINTERNET === undefined) {
        parsed.THANHTIENINTERNET = DON_GIA.INTERNET;
    }

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 1. Tạo khoản thu hộ mới (Cho 1 hộ trong 1 đợt)
const createPhiThuHo = async (data) => {
  try {
    console.log(data);
    const parsedData = phiThuHoDataParse(data);

    // Kiểm tra xem hộ này đã được kê khai trong đợt này chưa
    const existing = await prisma.pHITHUHO.findUnique({
        where: {
            MADOTTHU_MAHOKHAU: { // Cú pháp của Prisma cho Composite Key
                MADOTTHU: parsedData.MADOTTHU,
                MAHOKHAU: parsedData.MAHOKHAU
            }
        }
    });

    if (existing) {
        throw { status: 400, message: "Hộ khẩu này đã được kê khai phí trong đợt thu này rồi." };
    }

    const newPhi = await prisma.pHITHUHO.create({
      data: parsedData
    });
    return { newPhi };
  } catch (error) {
    if (error.code === 'P2003') throw { status: 400, message: "Mã đợt thu hoặc Mã hộ khẩu không hợp lệ" };
    throw { status: error.status || 500, message: error.message };
  }
};

// 2. Lấy danh sách (Lọc theo Đợt thu hoặc Hộ khẩu)
const getPhiThuHoList = async (filters, page = 1, limit = 20) => {
  try {
    const where = {};
    if (filters.MADOTTHU) where.MADOTTHU = parseInt(filters.MADOTTHU);
    if (filters.MAHOKHAU) where.MAHOKHAU = parseInt(filters.MAHOKHAU);

    const list = await prisma.pHITHUHO.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: {
        HOKHAU: { select: { MAPHONG: true, TENCHUHO: true } },
        DOTTHUPHI: { select: { TEN: true } }
      },
      orderBy: { MADOTTHU: 'desc' }
    });

    const count = await prisma.pHITHUHO.count({ where });

    return { list, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 3. Cập nhật (Sửa số điện/nước)
const updatePhiThuHo = async (maDotThu, maHoKhau, data) => {
    try {
        const parsedData = phiThuHoDataParse(data);
        // Không cho phép sửa ID khóa chính
        delete parsedData.MADOTTHU;
        delete parsedData.MAHOKHAU;

        const updated = await prisma.pHITHUHO.update({
            where: {
                MADOTTHU_MAHOKHAU: {
                    MADOTTHU: parseInt(maDotThu),
                    MAHOKHAU: parseInt(maHoKhau)
                }
            },
            data: parsedData
        });
        return { updated };
    } catch (error) {
        if (error.code === 'P2025') throw { status: 404, message: "Không tìm thấy bản ghi" };
        throw { status: 500, message: error.message };
    }
};

// 4. Xóa
const deletePhiThuHo = async (maDotThu, maHoKhau) => {
    try {
        const deleted = await prisma.pHITHUHO.delete({
            where: {
                MADOTTHU_MAHOKHAU: {
                    MADOTTHU: parseInt(maDotThu),
                    MAHOKHAU: parseInt(maHoKhau)
                }
            }
        });
        return { deleted };
    } catch (error) {
        if (error.code === 'P2025') throw { status: 404, message: "Không tìm thấy bản ghi" };
        throw { status: 500, message: error.message };
    }
};

module.exports = { 
  createPhiThuHo,
  getPhiThuHoList, 
  updatePhiThuHo, 
  deletePhiThuHo 
};