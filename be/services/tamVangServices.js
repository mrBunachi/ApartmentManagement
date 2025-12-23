const { prisma } = require("../config/database");

/**
 * Hàm parse dữ liệu cho model TAMVANG
 */
const tamVangDataParse = (data) => {
    try {
        const parsed = { ...data };

        if ("MADANGKYTAMVANG" in parsed) 
            parsed.MADANGKYTAMVANG = parseInt(parsed.MADANGKYTAMVANG, 10);
        
        if ("MANHANKHAU" in parsed) 
            parsed.MANHANKHAU = parseInt(parsed.MANHANKHAU, 10);

        if ("TUNGAY" in parsed && parsed.TUNGAY) 
            parsed.TUNGAY = new Date(parsed.TUNGAY);

        if ("DENNGAY" in parsed && parsed.DENNGAY) 
            parsed.DENNGAY = new Date(parsed.DENNGAY);

        return parsed;
    } catch (error) {
        throw { status: 500, message: "Lỗi định dạng dữ liệu tạm vắng: " + error.message };
    }
};

const createTamVang = async (data) => {
    try {
        const newTamVang = await prisma.tAMVANG.create({
            data: tamVangDataParse(data),
        });
        return { newTamVang };
    } catch (error) {
        if (error.code === 'P2003') { // Foreign key constraint failed
            throw { status: 400, message: 'Mã nhân khẩu không tồn tại' };
        }
        throw { status: 500, message: error.message };
    }
};

const getTamVangById = async (id, include = false) => {
    try {
        const tamVang = await prisma.tAMVANG.findUnique({
            where: {
                MADANGKYTAMVANG: parseInt(id),
            },
            include: include ? {
                NHANKHAU: true 
            } : undefined
        });

        if (!tamVang) throw { status: 404, message: 'Không tìm thấy thông tin tạm vắng' };

        return { tamVang };
    } catch (error) {
        if (error.status) throw error;
        throw { status: 500, message: error.message };
    }
};

const deleteTamVang = async (id) => {
    try {
        const deletedTamVang = await prisma.tAMVANG.delete({
            where: {
                MADANGKYTAMVANG: parseInt(id)
            }
        });
        return { deletedTamVang };
    } catch (error) {
        if (error.code === 'P2025') {
            throw { status: 404, message: 'Không tìm thấy thông tin tạm vắng để xóa' };
        }
        throw { status: 500, message: error.message };
    }
};

const updateTamVang = async (id, data) => {
    try {
        const updatedTamVang = await prisma.tAMVANG.update({
            where: {
                MADANGKYTAMVANG: parseInt(id)
            },
            data: tamVangDataParse(data)
        });
        return { updatedTamVang };
    } catch (error) {
        if (error.code === 'P2025') {
            throw { status: 404, message: 'Không tìm thấy thông tin tạm vắng để cập nhật' };
        }
        throw { status: 500, message: error.message };
    }
};

const getTamVangs = async (queryData, page = 1, limit = 10, include = false) => {
    try {
        const skip = (page - 1) * limit;
        const filter = tamVangDataParse(queryData);

        const tamVangs = await prisma.tAMVANG.findMany({
            skip: skip,
            take: limit,
            where: filter,
            include: include ? {
                NHANKHAU: {
                    select: {
                        HOTEN: true,
                        SOCANCUOC: true
                    }
                }
            } : undefined
        });

        const count = await prisma.tAMVANG.count({
            where: filter
        });

        return { tamVangs, count };
    } catch (error) {
        throw { status: 500, message: error.message };
    }
};

module.exports = {
    createTamVang,
    getTamVangById,
    deleteTamVang,
    updateTamVang,
    getTamVangs
};