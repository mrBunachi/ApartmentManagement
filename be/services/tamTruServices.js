const {prisma} = require("../config/database")

// model TAMTRU {
//   MADANGKYTAMTRU         Int       @id @default(autoincrement()) // Đặt làm @id
//   MANHANKHAU             Int
//   SODIENTHOAINGUOIDANGKY String?   @db.VarChar(15)
//   TUNGAY                 DateTime? @db.Date
//   DENNGAY                DateTime? @db.Date
//   LYDO                   String?
//   NHANKHAU               NHANKHAU  @relation(fields: [MANHANKHAU], references: [MANHANKHAU], onDelete: Cascade)
//   // Xóa @@id phức hợp
// }

const tamTruDataParse = (data) => {
    try {
        const parsed = { ...data };

        if ("MADANGKYTAMTRU" in parsed) 
            parsed.MADANGKYTAMTRU = parseInt(parsed.MADANGKYTAMTRU, 10);
        
        if ("MANHANKHAU" in parsed) 
            parsed.MANHANKHAU = parseInt(parsed.MANHANKHAU, 10);

        if ("TUNGAY" in parsed && parsed.TUNGAY) 
            parsed.TUNGAY = new Date(parsed.TUNGAY);

        if ("DENNGAY" in parsed && parsed.DENNGAY) 
            parsed.DENNGAY = new Date(parsed.DENNGAY);

        return parsed;
    } catch (error) {
        throw { status: 500, message: "Lỗi định dạng dữ liệu: " + error.message };
    }
};

const createTamTru = async (data) => {
    try {
        const newTamTru = await prisma.tAMTRU.create({
            data: tamTruDataParse(data),
        });
        return { newTamTru };
    } catch (error) {
        if (error.code === 'P2003') { // Foreign key constraint failed
            throw { status: 400, message: 'Mã nhân khẩu không tồn tại' };
        }
        throw { status: 500, message: error.message };
    }
};

const getTamTruById = async (id) => {
    try {
        const tamTru = await prisma.tAMTRU.findUnique({
            where: {
                MADANGKYTAMTRU: parseInt(id),
            },
            include: {
                NHANKHAU: {
                    select: {
                        HOTEN: true,
                        SOCANCUOC: true
                    }
                }
            }
        });

        if (!tamTru) throw { status: 404, message: 'Không tìm thấy thông tin tạm trú' };

        return { tamTru };
    } catch (error) {
        if (error.status) throw error;
        throw { status: 500, message: error.message };
    }
};

const deleteTamTru = async (id) => {
    try {
        const deletedTamTru = await prisma.tAMTRU.delete({
            where: {
                MADANGKYTAMTRU: parseInt(id)
            }
        });
        return { deletedTamTru };
    } catch (error) {
        if (error.code === 'P2025') {
            throw { status: 404, message: 'Không tìm thấy thông tin tạm trú để xóa' };
        }
        throw { status: 500, message: error.message };
    }
};

const updateTamTru = async (id, data) => {
    try {
        const updatedTamTru = await prisma.tAMTRU.update({
            where: {
                MADANGKYTAMTRU: parseInt(id)
            },
            data: tamTruDataParse(data)
        });
        return { updatedTamTru };
    } catch (error) {
        if (error.code === 'P2025') {
            throw { status: 404, message: 'Không tìm thấy thông tin tạm trú để cập nhật' };
        }
        throw { status: 500, message: error.message };
    }
};

const getTamTrus = async (queryData, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        
        // Remove 'include' param before parsing
        const { include, ...restQuery } = queryData;
        const filter = tamTruDataParse(restQuery);

        const tamTrus = await prisma.tAMTRU.findMany({
            skip: skip,
            take: limit,
            where: filter,
            include: {
                NHANKHAU: {
                    select: {
                        HOTEN: true,
                        SOCANCUOC: true
                    }
                }
            }
        });

        const count = await prisma.tAMTRU.count({
            where: filter
        });

        return { tamTrus, count };
    } catch (error) {
        throw { status: 500, message: error.message };
    }
};

module.exports = {
    createTamTru,
    getTamTruById,
    deleteTamTru,
    updateTamTru,
    getTamTrus
};