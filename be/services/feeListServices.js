const { prisma } = require("../config/database");

// Helper: Parse dữ liệu
const feeListDataParse = (data) => {
  try {
    const parsed = { ...data };

    // Parse số nguyên (Khóa chính)
    if ("MADOTTHU" in parsed) parsed.MADOTTHU = parseInt(parsed.MADOTTHU, 10);
    if ("MAHOKHAU" in parsed) parsed.MAHOKHAU = parseInt(parsed.MAHOKHAU, 10);

    // Parse tiền tệ (Decimal -> Float)
    const moneyFields = [
      "TIENNHA", "TIENDICHVU", "TIENXEMAY", "TIENOTO", 
      "SODIEN", "SONUOC", "TIENINTERNET", "SOTIENDADONG"
    ];
    moneyFields.forEach(field => {
      if (field in parsed && parsed[field] !== null) {
        parsed[field] = parseFloat(parsed[field]);
      }
    });

    // Parse ngày tháng
    if ("NGAYDONG" in parsed && parsed.NGAYDONG) {
      parsed.NGAYDONG = new Date(parsed.NGAYDONG);
    }

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 1. Tạo mới bản ghi thu phí
const createFeeListEntry = async (data) => {
  try {
    const parsedData = feeListDataParse(data);
    
    // Kiểm tra tồn tại (Prisma sẽ báo lỗi nếu trùng PK, nhưng kiểm tra thủ công để custom message rõ hơn)
    const existing = await prisma.dANHSACHTHUPHI.findUnique({
      where: {
        MADOTTHU_MAHOKHAU: {
          MADOTTHU: parsedData.MADOTTHU,
          MAHOKHAU: parsedData.MAHOKHAU
        }
      }
    });

    if (existing) {
      throw { status: 400, message: "Hộ khẩu này đã có trong danh sách thu của đợt này" };
    }

    const newEntry = await prisma.dANHSACHTHUPHI.create({
      data: parsedData,
    });
    return { newEntry };
  } catch (error) {
    // Lỗi khóa ngoại (P2003)
    if (error.code === 'P2003') throw { status: 400, message: 'Mã đợt thu hoặc Mã hộ khẩu không hợp lệ' };
    throw { status: error.status || 500, message: error.message };
  }
};

// 2. Lấy danh sách (lọc theo đợt thu, hộ khẩu, trạng thái...)
const getFeeList = async (filters, page = 1, limit = 20) => {
  try {
    const parsedFilters = feeListDataParse(filters);
    
    // Xử lý tìm kiếm gần đúng nếu cần (ví dụ TENDONGTIEN)
    if (parsedFilters.TENDONGTIEN) {
        parsedFilters.TENDONGTIEN = { contains: parsedFilters.TENDONGTIEN, mode: 'insensitive' };
    }

    const feeList = await prisma.dANHSACHTHUPHI.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: parsedFilters,
      include: {
        DOTTHUPHI: { select: { TEN: true } },
        HOKHAU: { select: { MAPHONG: true, TENCHUHO: true } }
      },
      orderBy: {
        MADOTTHU: 'desc' // Hoặc sắp xếp theo ý muốn
      }
    });

    const count = await prisma.dANHSACHTHUPHI.count({
      where: parsedFilters,
    });

    return { feeList, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 3. Lấy chi tiết theo Composite Key
const getFeeListEntryById = async (madotthu, mahokhau) => {
  try {
    const entry = await prisma.dANHSACHTHUPHI.findUnique({
      where: {
        MADOTTHU_MAHOKHAU: {
          MADOTTHU: parseInt(madotthu),
          MAHOKHAU: parseInt(mahokhau)
        }
      },
      include: {
        DOTTHUPHI: true,
        HOKHAU: true
      }
    });

    if (!entry) {
        throw { status: 404, message: 'Không tìm thấy bản ghi thu phí' };
    }

    return { entry };
  } catch (error) {
    throw { status: error.status || 500, message: error.message };
  }
};

// 4. Cập nhật
const updateFeeListEntry = async (madotthu, mahokhau, data) => {
  try {
    const updatedEntry = await prisma.dANHSACHTHUPHI.update({
      where: {
        MADOTTHU_MAHOKHAU: {
          MADOTTHU: parseInt(madotthu),
          MAHOKHAU: parseInt(mahokhau)
        }
      },
      data: feeListDataParse(data),
    });
    return { updatedEntry };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy bản ghi để cập nhật' };
    throw { status: 500, message: error.message };
  }
};

// 5. Xóa
const deleteFeeListEntry = async (madotthu, mahokhau) => {
  try {
    const deletedEntry = await prisma.dANHSACHTHUPHI.delete({
      where: {
        MADOTTHU_MAHOKHAU: {
          MADOTTHU: parseInt(madotthu),
          MAHOKHAU: parseInt(mahokhau)
        }
      },
    });
    return { deletedEntry };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy bản ghi để xóa' };
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  createFeeListEntry,
  getFeeList,
  getFeeListEntryById,
  updateFeeListEntry,
  deleteFeeListEntry
};