const { prisma } = require("../config/database");

// Helper: Parse dữ liệu
const feeTypeDataParse = (data) => {
  try {
    const parsed = { ...data };

    // Không parse MALOAIPHI ở đây vì ID thường do DB tự sinh hoặc truyền qua params
    // Nếu update thì ID nằm ở params, nếu create thì không cần ID.
    if ("MALOAIPHI" in parsed) delete parsed.MALOAIPHI; 
    
    // Nếu frontend gửi NGAYTAO, parse nó, nếu không để DB tự default
    if ("NGAYTAO" in parsed && parsed.NGAYTAO) {
      parsed.NGAYTAO = new Date(parsed.NGAYTAO);
    } else {
       delete parsed.NGAYTAO; // Để Prisma dùng @default(now())
    }

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 1. Tạo mới loại phí
const createFeeType = async (data) => {
  try {
    // Kiểm tra trùng tên
    const existing = await prisma.lOAIPHI.findFirst({
        where: { TEN: data.TEN }
    });
    if (existing) {
         throw { status: 400, message: 'Tên loại phí đã tồn tại' };
    }

    const newFeeType = await prisma.lOAIPHI.create({
      data: feeTypeDataParse(data),
    });
    return { newFeeType };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 2. Lấy danh sách (ĐÃ SỬA: Thêm logic phân trang)
const getFeeTypes = async (filters, page = 1, limit = 20) => {
  try {
    const where = {};
    
    // Tìm kiếm theo tên (nếu có)
    if (filters.TEN) {
        where.TEN = { contains: filters.TEN, mode: 'insensitive' }; // mode insensitive để tìm ko phân biệt hoa thường
    }

    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;

    const feeTypes = await prisma.lOAIPHI.findMany({
      where,
      skip: skip,
      take: limit,
      orderBy: {
        MALOAIPHI: 'desc' // Thường user muốn xem cái mới tạo nhất
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