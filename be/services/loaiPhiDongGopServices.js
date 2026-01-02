const { prisma } = require("../config/database");

/**
 * Lấy danh sách các loại phí/quỹ đóng góp
 */
const getLoaiPhis = async () => {
  try {
    const loaiPhis = await prisma.lOAIPHI.findMany({
      orderBy: {
        NGAYTAO: 'desc',
      },
      include: {
        // Có thể đếm số lượt đóng góp nếu cần
        _count: {
          select: { DONGGOP: true } 
        }
      }
    });
    return loaiPhis;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

/**
 * Tạo mới loại phí (Ví dụ: Quỹ khuyến học, Quỹ vì người nghèo)
 */
const createLoaiPhi = async (data) => {
  try {
    if (!data.TEN) {
        throw { status: 400, message: "Tên loại phí là bắt buộc" };
    }

    const newLoaiPhi = await prisma.lOAIPHI.create({
      data: {
        TEN: data.TEN,
        MOTA: data.MOTA,
        NGAYTAO: new Date(), // Mặc định là now(), nhưng gán explicit cho rõ ràng
      },
    });
    return newLoaiPhi;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

/**
 * Cập nhật thông tin loại phí
 */
const updateLoaiPhi = async (id, data) => {
  try {
    const updated = await prisma.lOAIPHI.update({
      where: {
        MALOAIPHI: parseInt(id),
      },
      data: {
        TEN: data.TEN,
        MOTA: data.MOTA,
      },
    });
    return updated;
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy loại phí' };
    }
    throw { status: 500, message: error.message };
  }
};

/**
 * Xóa loại phí
 * Lưu ý: Do schema có onDelete: Cascade, xóa loại phí sẽ xóa hết lịch sử đóng góp của loại này.
 */
const deleteLoaiPhi = async (id) => {
  try {
    await prisma.lOAIPHI.delete({
      where: {
        MALOAIPHI: parseInt(id),
      },
    });
    return { message: 'Xóa loại phí thành công' };
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy loại phí' };
    }
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  getLoaiPhis,
  createLoaiPhi,
  updateLoaiPhi,
  deleteLoaiPhi,
};