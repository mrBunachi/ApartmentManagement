const { prisma } = require("../config/database");

// Helper: Parse dữ liệu
const fixedFeeDataParse = (data) => {
  try {
    const parsed = { ...data };

    // Parse các trường tiền tệ (Decimal trong DB -> Float trong JS)
    if ("GIATIENCANHO" in parsed) parsed.GIATIENCANHO = parseFloat(parsed.GIATIENCANHO);
    if ("PHIQLCHUNGCU" in parsed) parsed.PHIQLCHUNGCU = parseFloat(parsed.PHIQLCHUNGCU);
    if ("PHIKEDAP" in parsed) parsed.PHIKEDAP = parseFloat(parsed.PHIKEDAP);
    if ("PHIXEOTO" in parsed) parsed.PHIXEOTO = parseFloat(parsed.PHIXEOTO);

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 1. Tạo mới loại phí cố định
const createFixedFee = async (data) => {
  try {
    // Kiểm tra xem loại căn hộ đã tồn tại chưa
    const existingFee = await prisma.pHICODINH.findUnique({
        where: { LOAICANHO: data.LOAICANHO }
    });
    if (existingFee) {
        throw { status: 400, message: 'Loại căn hộ này đã tồn tại' };
    }

    const newFixedFee = await prisma.pHICODINH.create({
      data: fixedFeeDataParse(data),
    });
    return { newFixedFee };
  } catch (error) {
    throw { status: error.status || 500, message: error.message };
  }
};

// 2. Lấy danh sách (có lọc theo tên loại căn hộ)
const getFixedFees = async (filters) => {
  try {
    const where = {};
    
    // Tìm kiếm gần đúng theo tên loại căn hộ
    if (filters.LOAICANHO) {
        where.LOAICANHO = { contains: filters.LOAICANHO, mode: 'insensitive' };
    }

    const fixedFees = await prisma.pHICODINH.findMany({
      where,
      orderBy: {
        LOAICANHO: 'asc'
      }
    });

    const count = await prisma.pHICODINH.count({ where });

    return { fixedFees, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 3. Lấy chi tiết theo ID (LOAICANHO)
const getFixedFeeById = async (id) => {
  try {
    // ID ở đây là String (ví dụ: 'CC_CAO_CAP')
    const fixedFee = await prisma.pHICODINH.findUnique({
      where: {
        LOAICANHO: id, 
      },
      // Có thể include danh sách hộ khẩu thuộc loại này nếu cần
      // include: { HOKHAU: true } 
    });

    if (!fixedFee) {
        throw { status: 404, message: 'Không tìm thấy loại phí cố định' };
    }

    return { fixedFee };
  } catch (error) {
    throw { status: error.status || 500, message: error.message };
  }
};

// 4. Cập nhật
const updateFixedFee = async (id, data) => {
  try {
    const updatedFixedFee = await prisma.pHICODINH.update({
      where: {
        LOAICANHO: id,
      },
      data: fixedFeeDataParse(data),
    });
    return { updatedFixedFee };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy loại phí để cập nhật' };
    throw { status: 500, message: error.message };
  }
};

// 5. Xóa
const deleteFixedFee = async (id) => {
  try {
    const deletedFixedFee = await prisma.pHICODINH.delete({
      where: {
        LOAICANHO: id,
      },
    });
    return { deletedFixedFee };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy loại phí để xóa' };
    // Lỗi ràng buộc khóa ngoại (P2003): Không thể xóa nếu đang có Hộ khẩu sử dụng loại phí này
    if (error.code === 'P2003') throw { status: 400, message: 'Không thể xóa vì đang có hộ khẩu thuộc loại phí này' };
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  createFixedFee,
  getFixedFees,
  getFixedFeeById,
  updateFixedFee,
  deleteFixedFee
};