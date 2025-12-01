const { prisma } = require("../config/database");

// Helper: Parse dữ liệu
const feeTypeDataParse = (data) => {
  try {
    const parsed = { ...data };

    if ("MALOAIPHI" in parsed) parsed.MALOAIPHI = parseInt(parsed.MALOAIPHI, 10);
    
    if ("NGAYTAO" in parsed && parsed.NGAYTAO) {
      parsed.NGAYTAO = new Date(parsed.NGAYTAO);
    }

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 1. Tạo mới loại phí
const createFeeType = async (data) => {
  try {
    // Kiểm tra trùng tên (nếu cần thiết)
    const existing = await prisma.lOAIPHI.findFirst({
        where: { TEN: data.TEN }
    });
    if (existing) {
        // Tùy business logic, có thể throw lỗi hoặc vẫn cho tạo
        // throw { status: 400, message: 'Tên loại phí đã tồn tại' };
    }

    const newFeeType = await prisma.lOAIPHI.create({
      data: feeTypeDataParse(data),
    });
    return { newFeeType };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 2. Lấy danh sách
const getFeeTypes = async (filters) => {
  try {
    const where = {};
    
    // Tìm kiếm theo tên
    if (filters.TEN) {
        where.TEN = { contains: filters.TEN, mode: 'insensitive' };
    }

    const feeTypes = await prisma.lOAIPHI.findMany({
      where,
      orderBy: {
        MALOAIPHI: 'asc'
      }
    });

    const count = await prisma.lOAIPHI.count({ where });

    return { feeTypes, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 3. Lấy chi tiết
const getFeeTypeById = async (id) => {
  try {
    const feeType = await prisma.lOAIPHI.findUnique({
      where: {
        MALOAIPHI: parseInt(id),
      },
      // Include danh sách đóng góp thuộc loại này nếu cần kiểm tra
      // include: { DONGGOP: true }
    });

    if (!feeType) {
        throw { status: 404, message: 'Không tìm thấy loại phí' };
    }

    return { feeType };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy loại phí' };
    throw { status: 500, message: error.message };
  }
};

// 4. Cập nhật
const updateFeeType = async (id, data) => {
  try {
    const updatedFeeType = await prisma.lOAIPHI.update({
      where: {
        MALOAIPHI: parseInt(id),
      },
      data: feeTypeDataParse(data),
    });
    return { updatedFeeType };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy loại phí để cập nhật' };
    throw { status: 500, message: error.message };
  }
};

// 5. Xóa
const deleteFeeType = async (id) => {
  try {
    const deletedFeeType = await prisma.lOAIPHI.delete({
      where: {
        MALOAIPHI: parseInt(id),
      },
    });
    return { deletedFeeType };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy loại phí để xóa' };
    // Lỗi khóa ngoại: Không thể xóa nếu đã có khoản đóng góp tham chiếu đến loại phí này
    if (error.code === 'P2003') throw { status: 400, message: 'Không thể xóa loại phí này vì đã có dữ liệu đóng góp liên quan' };
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  createFeeType,
  getFeeTypes,
  getFeeTypeById,
  updateFeeType,
  deleteFeeType
};