const { prisma } = require("../config/database");

/**
 * Lấy danh sách đóng góp (có phân trang & lọc)
 */
const getDongGops = async (filters, page = 1, limit = 10) => {
  try {
    const queryConditions = {};

    // Lọc theo Mã đợt thu
    if (filters.MADOTTHU) {
      queryConditions.MADOTTHU = parseInt(filters.MADOTTHU);
    }

    // Lọc theo Mã hộ khẩu
    if (filters.MAHOKHAU) {
      queryConditions.MAHOKHAU = parseInt(filters.MAHOKHAU);
    }
    
    // Lọc theo Mã loại phí (Quỹ)
    if (filters.MALOAIPHI) {
      queryConditions.MALOAIPHI = parseInt(filters.MALOAIPHI);
    }

    // Lọc tìm kiếm theo tên chủ hộ (nếu cần xử lý phức tạp hơn thì cần join, ở đây xử lý cơ bản)
    
    const dongGops = await prisma.dONGGOP.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: queryConditions,
      include: {
        DOTTHUPHI: {
            select: { TEN: true } // Lấy tên đợt thu
        },
        HOKHAU: {
            select: { 
                MAPHONG: true, 
                THONGTINCHUHO: {
                    select: { HOTEN: true }
                }
            }
        },
        LOAIPHI: {
            select: { TEN: true } // Lấy tên quỹ
        }
      },
      orderBy: {
        NGAYDONG: 'desc' 
      }
    });

    const count = await prisma.dONGGOP.count({
      where: queryConditions,
    });

    return { dongGops, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

/**
 * Tạo mới một khoản đóng góp
 */
const createDongGop = async (data) => {
  try {
    // Validate dữ liệu cơ bản
    if (!data.MAHOKHAU || !data.SOTIENDADONG) {
        throw { status: 400, message: "Thiếu thông tin Hộ khẩu hoặc Số tiền" };
    }

    const newDongGop = await prisma.dONGGOP.create({
      data: {
        MADOTTHU: data.MADOTTHU ? parseInt(data.MADOTTHU) : null,
        MAHOKHAU: parseInt(data.MAHOKHAU),
        MALOAIPHI: data.MALOAIPHI ? parseInt(data.MALOAIPHI) : null,
        SOTIENDADONG: parseFloat(data.SOTIENDADONG), // Decimal
        NGAYDONG: data.NGAYDONG ? new Date(data.NGAYDONG) : new Date(),
        HINHTHUC: data.HINHTHUC || "Tiền mặt",
        GHICHU: data.GHICHU,
        TRANGTHAI: true // Mặc định tạo xong là đã đóng
      },
    });
    return newDongGop;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

/**
 * Cập nhật thông tin đóng góp
 */
const updateDongGop = async (id, data) => {
  try {
    // Parse dữ liệu nếu có gửi lên
    const updateData = {};
    if (data.SOTIENDADONG !== undefined) updateData.SOTIENDADONG = parseFloat(data.SOTIENDADONG);
    if (data.HINHTHUC !== undefined) updateData.HINHTHUC = data.HINHTHUC;
    if (data.GHICHU !== undefined) updateData.GHICHU = data.GHICHU;
    if (data.NGAYDONG !== undefined) updateData.NGAYDONG = new Date(data.NGAYDONG);

    const updated = await prisma.dONGGOP.update({
      where: {
        MADONGGOP: parseInt(id),
      },
      data: updateData,
    });
    return updated;
  }
  catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy phiếu đóng góp' };
    }
    throw { status: 500, message: error.message };
  }
};

/**
 * Xóa phiếu đóng góp
 */
const deleteDongGop = async (id) => {
  try {
    await prisma.dONGGOP.delete({
      where: {
        MADONGGOP: parseInt(id),
      },
    });
    return { message: 'Xóa phiếu đóng góp thành công' };
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy phiếu đóng góp' };
    } else {
      throw { status: 500, message: error.message };
    }
  }
};

module.exports = {
  getDongGops,
  createDongGop,
  updateDongGop,
  deleteDongGop,
};