const { prisma } = require("../config/database");

const feeDataParse = (data) => {
  try {
    const parsed = { ...data };

    // Parse số nguyên
    if ("MADOTTHU" in parsed) parsed.MADOTTHU = parseInt(parsed.MADOTTHU, 10);
    if ("NGUOIQUANLYId" in parsed) parsed.NGUOIQUANLYId = parseInt(parsed.NGUOIQUANLYId, 10);

    // Parse Boolean
    if ("BATBUOC" in parsed) {
      parsed.BATBUOC = parsed.BATBUOC === 'true' || parsed.BATBUOC === true;
    }

    // Parse String (Tìm kiếm gần đúng cho Tên đợt thu)
    if ("TEN" in parsed) {
      parsed.TEN = { contains: parsed.TEN, mode: 'insensitive' }; // mode: insensitive để không phân biệt hoa thường
    }

    return parsed;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

const getDotThuPhis = async (filters, page, limit) => {
  try {
    const parsedFilters = feeDataParse(filters);
    console.log(filters);
    const dotThuPhis = await prisma.dOTTHUPHI.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: parsedFilters,
      include: {
        NGUOIQUANLY: {
          select: { 
            id: true, 
            HOTEN: true, 
            TENDANGNHAP: true 
          }
        }
      },
      orderBy: {
        NGAYTAO: 'desc' 
      }
    });

    const count = await prisma.dOTTHUPHI.count({
      where: parsedFilters,
    });

    return { dotThuPhis, count };
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

const getDotThuPhiById = async (id) => {
  try {
    const dotThuPhi = await prisma.dOTTHUPHI.findUnique({
      where: {
        MADOTTHU: parseInt(id),
      },
      include: {
        NGUOIQUANLY: {
          select: { id: true, HOTEN: true }
        },
      }
    });

    return { dotThuPhi };
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy đợt thu phí' };
    }
    throw { status: 500, message: error.message };
  }
};

const createDotThuPhi = async (dotThuPhiData) => {
  try {
    // Parse dữ liệu trước khi tạo
    const parsedData = { ...dotThuPhiData };
    
    // Parse NGUOIQUANLYId thành số nguyên
    if (parsedData.NGUOIQUANLYId) {
      parsedData.NGUOIQUANLYId = parseInt(parsedData.NGUOIQUANLYId, 10);
    }
    
    // Parse BATBUOC thành boolean
    if ('BATBUOC' in parsedData) {
      parsedData.BATBUOC = parsedData.BATBUOC === 'true' || parsedData.BATBUOC === true;
    }
    
    // Parse các trường Date
    if (parsedData.NGAYBATDAU) {
      parsedData.NGAYBATDAU = new Date(parsedData.NGAYBATDAU);
    }
    if (parsedData.NGAYKETTHUC) {
      parsedData.NGAYKETTHUC = new Date(parsedData.NGAYKETTHUC);
    }
    
    const newDotThuPhi = await prisma.dOTTHUPHI.create({
      data: parsedData,
    });
    return newDotThuPhi;
  } catch (error) {
    console.error('❌ Error creating DotThuPhi:', error);
    throw { status: 500, message: error.message };
  }
};

const updateDotThuPhi = async (id, dotThuPhiData) => {
  try {
    // Parse dữ liệu trước khi update
    const parsedData = { ...dotThuPhiData };
    
    // Parse NGUOIQUANLYId thành số nguyên
    if (parsedData.NGUOIQUANLYId) {
      parsedData.NGUOIQUANLYId = parseInt(parsedData.NGUOIQUANLYId, 10);
    }
    
    // Parse BATBUOC thành boolean
    if ('BATBUOC' in parsedData) {
      parsedData.BATBUOC = parsedData.BATBUOC === 'true' || parsedData.BATBUOC === true;
    }
    
    // Parse các trường Date
    if (parsedData.NGAYBATDAU) {
      parsedData.NGAYBATDAU = new Date(parsedData.NGAYBATDAU);
    }
    if (parsedData.NGAYKETTHUC) {
      parsedData.NGAYKETTHUC = new Date(parsedData.NGAYKETTHUC);
    }
    
    const updateDotThuPhi = await prisma.dOTTHUPHI.update({
      where: {
        MADOTTHU: parseInt(id),
      },
      data: parsedData,
    });
    return updateDotThuPhi;
  }
  catch (error) {
    console.error('❌ Error updating DotThuPhi:', error);
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy đợt thu phí' };
    }
    throw { status: 500, message: error.message };
  }
};

const deleteDotThuPhi = async (id) => {
  try {
    await prisma.dOTTHUPHI.delete({
      where: {
        MADOTTHU: parseInt(id),
      },
    });
    return { message: 'Xóa đợt thu phí thành công' };
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Không tìm thấy đợt thu phí' };
    } else {
      throw { status: 500, message: error.message };
    }
  }
};

module.exports = {
  getDotThuPhis,
  getDotThuPhiById,
  createDotThuPhi,
  updateDotThuPhi,
  deleteDotThuPhi,
};