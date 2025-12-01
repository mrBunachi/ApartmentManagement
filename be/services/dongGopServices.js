const { prisma } = require("../config/database");

const contributionDataParse = (data) => {
  try {
    const parsed = { ...data };

    // Parse số nguyên
    if ("MADONGGOP" in parsed) parsed.MADONGGOP = parseInt(parsed.MADONGGOP, 10);
    if ("MADOTTHU" in parsed && parsed.MADOTTHU) parsed.MADOTTHU = parseInt(parsed.MADOTTHU, 10);
    if ("MAHOKHAU" in parsed && parsed.MAHOKHAU) parsed.MAHOKHAU = parseInt(parsed.MAHOKHAU, 10);
    if ("MALOAIPHI" in parsed && parsed.MALOAIPHI) parsed.MALOAIPHI = parseInt(parsed.MALOAIPHI, 10);

    // Parse ngày tháng
    if ("NGAYDONG" in parsed && parsed.NGAYDONG) {
      parsed.NGAYDONG = new Date(parsed.NGAYDONG);
    }

    // Parse số thực (Tiền)
    if ("SOTIENDADONG" in parsed) {
      parsed.SOTIENDADONG = parseFloat(parsed.SOTIENDADONG);
    }

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 1. Tạo khoản đóng góp mới
const createContribution = async (data) => {
  try {
    const newContribution = await prisma.dONGGOP.create({
      data: contributionDataParse(data),
    });
    return { newContribution };
  } catch (error) {
    // Lỗi khóa ngoại (Ví dụ: ID đợt thu hoặc ID hộ khẩu không tồn tại)
    if (error.code === 'P2003') {
       throw { status: 400, message: 'Thông tin tham chiếu (Đợt thu/Hộ khẩu/Loại phí) không hợp lệ' };
    }
    throw { status: 500, message: error.message };
  }
};

// 2. Lấy danh sách đóng góp (có lọc và phân trang)
const getContributions = async (filters, page = 1, limit = 20) => {
  try {
    const parsedFilters = contributionDataParse(filters);

    // Xử lý tìm kiếm theo tên chủ hộ (gần đúng)
    if (parsedFilters.TENCHUHO) {
        parsedFilters.TENCHUHO = { contains: parsedFilters.TENCHUHO, mode: 'insensitive' };
    }

    const contributions = await prisma.dONGGOP.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: parsedFilters,
      include: {
        DOTTHUPHI: { select: { TEN: true } }, // Lấy tên đợt thu
        HOKHAU: { select: { MAPHONG: true } }, // Lấy mã phòng
        LOAIPHI: { select: { TEN: true } }    // Lấy tên loại phí
      },
      orderBy: {
        NGAYDONG: 'desc'
      }
    });

    const count = await prisma.dONGGOP.count({
      where: parsedFilters,
    });

    return { contributions, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

// 3. Lấy chi tiết đóng góp theo ID
const getContributionById = async (id) => {
  try {
    const contribution = await prisma.dONGGOP.findUnique({
      where: {
        MADONGGOP: parseInt(id),
      },
      include: {
        DOTTHUPHI: true,
        HOKHAU: true,
        LOAIPHI: true
      }
    });

    if (!contribution) {
        throw { status: 404, message: 'Không tìm thấy khoản đóng góp' };
    }

    return { contribution };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy khoản đóng góp' };
    throw { status: 500, message: error.message };
  }
};

// 4. Cập nhật khoản đóng góp
const updateContribution = async (id, data) => {
  try {
    const updatedContribution = await prisma.dONGGOP.update({
      where: {
        MADONGGOP: parseInt(id),
      },
      data: contributionDataParse(data),
    });
    return { updatedContribution };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy khoản đóng góp' };
    throw { status: 500, message: error.message };
  }
};

// 5. Xóa khoản đóng góp
const deleteContribution = async (id) => {
  try {
    const deletedContribution = await prisma.dONGGOP.delete({
      where: {
        MADONGGOP: parseInt(id),
      },
    });
    return { deletedContribution };
  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: 'Không tìm thấy khoản đóng góp' };
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  createContribution,
  getContributions,
  getContributionById,
  updateContribution,
  deleteContribution
};