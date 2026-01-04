const {prisma} = require("../config/database")

// model NHANKHAU {
//   MANHANKHAU                       Int       @id @default(autoincrement())
//   MAHOKHAU                         Int?
//   HOTEN                            String
//   SOCANCUOC                        String?   @unique @db.VarChar(20)
//   NGAYSINH                         DateTime? @db.Date
//   GIOITINH                         String?   @db.VarChar(10)
//   NOISINH                          String?
//   NGUYENQUAN                       String?
//   DANTOC                           String?   @db.VarChar(30)
//   TONGIAO                          String?   @db.VarChar(30)
//   QUOCTICH                         String?   @db.VarChar(50)
//   NOITHUONGTRU                     String?
//   NGHENGHIEP                       String?
//   NGAYTAO                          DateTime? @default(now())
//   QUANHEVOICHUHO                   String?   @db.VarChar(50)
//   GHICHU                           String?
//   ACTIVATE                         Boolean   @default(true)
//   HOKHAU_HOKHAU_IDCHUHOToNHANKHAU  HOKHAU[]  @relation("HOKHAU_IDCHUHOToNHANKHAU")
//   HOKHAU_NHANKHAU_MAHOKHAUToHOKHAU HOKHAU?   @relation("NHANKHAU_MAHOKHAUToHOKHAU", fields: [MAHOKHAU], references: [MAHOKHAU])
//   TAMTRU                           TAMTRU[]
//   TAMVANG                          TAMVANG[]
// }
const resDataParse = (data) => {
  try {
    const parsed = { ...data }

    if ("MANHANKHAU" in parsed) parsed.MANHANKHAU = parseInt(parsed.MANHANKHAU, 10)
    if ("MAHOKHAU" in parsed && parsed.MAHOKHAU !== null)
      parsed.MAHOKHAU = parseInt(parsed.MAHOKHAU, 10)

    if ("NGAYSINH" in parsed && parsed.NGAYSINH)
      parsed.NGAYSINH = new Date(parsed.NGAYSINH)

    if ("NGAYTAO" in parsed && parsed.NGAYTAO)
      parsed.NGAYTAO = new Date(parsed.NGAYTAO)

    if ("ACTIVATE" in parsed)
      parsed.ACTIVATE = parsed.ACTIVATE === 'true'

    return parsed
  } catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
                throw { status: 404, message: 'User not found' }
            }
                throw { status: 500, message: error.message }
    }
}

// 1. Tạo mới nhân khẩu
const createResident = async (data) => {
    try {
        const parsedData = resDataParse(data);

        // Validate: Nếu gán vào hộ khẩu ngay, kiểm tra hộ khẩu có tồn tại/active không
        if (parsedData.MAHOKHAU) {
            const house = await prisma.hOKHAU.findFirst({
                where: { MAHOKHAU: parsedData.MAHOKHAU, ACTIVATE: true }
            });
            if (!house) {
                throw { status: 400, message: 'Hộ khẩu không tồn tại hoặc chưa kích hoạt' };
            }
        }

        const newRes = await prisma.nHANKHAU.create({
            data: parsedData
        })
        return { newRes };
    } catch (error) {
        if (error.code === 'P2003') { 
             throw { status: 400, message: 'Dữ liệu tham chiếu không hợp lệ (Mã hộ khẩu...)' }
        }
        throw { status: 500, message: error.message }
    }
}

const getResById = async (id , active=null, include = false) => {
    try{
        const where ={
            MANHANKHAU:{
                equals:parseInt(id),
            },
        };
        const resident =await prisma.nHANKHAU.findFirst({
            where,
            include:include ? {
                    HOKHAU:{
                        select:{
                            MAHOKHAU:true,
                            MAPHONG:true,
                        }
                    }
                } : undefined
        });
        return {resident}

    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
                throw { status: 404, message: 'User not found' }
            }
                throw { status: 500, message: error.message }
    }
}
const deleteResident = async(id) => {
    try {
        let deleteRes
        const nhankhau = parseInt(id)
        const findAparList = await prisma.hOKHAU.findMany({
            where:{IDCHUHO:nhankhau, ACTIVATE:true}
        })
        if(findAparList.length > 0){
            const houseIds = findAparList.map(h => h.MAHOKHAU).join(', ');
            throw { 
                status: 400, 
                message: `Không thể xóa công dân này vì đang là Chủ hộ của các hộ khẩu: [${houseIds}]. Vui lòng chuyển quyền chủ hộ hoặc xóa hộ khẩu trước.` 
            };
        }
        else{
            const result = await prisma.$transaction(async (db) =>{
                const delRes = await db.nHANKHAU.update({
                    where:{MANHANKHAU:nhankhau},
                    data:{ACTIVATE:false,
                        NGAYKETTHUC:new Date()
                    }
                })
                const historyData ={
                    NHANKHAU: {
                        connect: { MANHANKHAU: delRes.MANHANKHAU }
                    },
        
        // Nếu MAHOKHAU trong DB là bắt buộc (Int), bạn cũng phải connect HOKHAU
                    ...(delRes.MAHOKHAU && {
                        HOKHAU: {
                            connect: { MAHOKHAU: delRes.MAHOKHAU }
                        }
                    }),           // Lưu ID hộ khẩu cũ
                    LOAITHAYDOI: 'XOA_NGUOI_O',    // Đánh dấu lý do
                    CHUCVU_CU: delRes.QUANHEVOICHUHO, // Lưu lại chức vụ cũ (Chủ hộ/Con...)
                    GHI_CHU: 'Ngưởi ở đã bị xóa',
                    NGAYBATDAU:delRes.NGAYTAO,
                    NGAYKETTHUC: new Date()        // Nếu DB chưa để default now()
                }
                await db.lICHSU_CUTRU.create({data:historyData})
                return delRes
            })
            deleteRes = result
        }
        

        // Trả về trực tiếp deleteRes để có thông tin nhân khẩu vừa cập nhật
        return {deleteRes}; 
    }
    catch (error) {
        if (error.code === 'P2025') {
            throw { status: 404, message: 'User not found' };
        }
        throw { status: 500, message: error.message };
    }
}
// 4. Cập nhật nhân khẩu (Xử lý logic chuyển nhà)
const updateResident = async (id, data) => {
    try {
        const nhankhauId = parseInt(id)
        const parsedData = resDataParse(data)
        
        // Logic chuyển hộ khẩu (Nếu có gửi MAHOKHAU mới và khác MAHOKHAU cũ)
        if (parsedData.MAHOKHAU) {
            const currentRes = await prisma.nHANKHAU.findUnique({
                where: { MANHANKHAU: nhankhauId }
            })

            if (!currentRes) throw { status: 404, message: 'User not found' };

            // Nếu thay đổi hộ khẩu
            if (currentRes.MAHOKHAU && currentRes.MAHOKHAU !== parsedData.MAHOKHAU) {

                // 2. Ghi lịch sử "Chuyển đi" ở nhà cũ
                await prisma.lICHSU_CUTRU.create({
                    data: {
                        MANHANKHAU: nhankhauId,
                        MAHOKHAU: currentRes.MAHOKHAU,
                        LOAITHAYDOI: 'CHUYEN_KHAI_BAO',
                        CHUCVU_CU: currentRes.QUANHEVOICHUHO,
                        GHI_CHU: `Chuyển sang hộ khẩu mới: ${parsedData.MAHOKHAU}`,
                        NGAYBATDAU: currentRes.NGAYTAO, 
                        NGAYKETTHUC: new Date()
                    }
                })
                
                // Lưu ý: Khi chuyển sang nhà mới, QUANHEVOICHUHO nên được reset hoặc client phải gửi kèm
                // Nếu client không gửi quan hệ mới, ta set tạm là null hoặc 'Thành viên'
                if (!parsedData.QUANHEVOICHUHO) {
                    parsedData.QUANHEVOICHUHO = null; 
                }
            }
        }

        const updateRes = await prisma.nHANKHAU.update({
            where: { MANHANKHAU: nhankhauId },
            data: parsedData
        });
        
        return { updateRes };
    } catch (error) {
        if (error.status) throw error;
        if (error.code === 'P2025') throw { status: 404, message: 'User not found' };
        if (error.code === 'P2003') throw { status: 400, message: 'Hộ khẩu mới không tồn tại' };
        throw { status: 500, message: error.message }
    }
}

const getResidents = async (data, page=1, limit = 10, include = false) => {
    try{
        // Build where clause with search support
        const whereClause = {};
        const parsedData = resDataParse(data);
        
        // Handle search fields
        if (parsedData.HOTEN) {
            // Search by name (contains)
            whereClause.HOTEN = {
                contains: parsedData.HOTEN,
                mode: 'insensitive'
            };
        }
        
        if (parsedData.SOCANCUOC) {
            // Exact match for ID card
            whereClause.SOCANCUOC = parsedData.SOCANCUOC;
        }
        
        if (parsedData.NGAYSINH) {
            // Exact match for birth date
            whereClause.NGAYSINH = parsedData.NGAYSINH;
        }
        
        // Copy other filter fields
        Object.keys(parsedData).forEach(key => {
            if (!['HOTEN', 'SOCANCUOC', 'NGAYSINH', 'page', 'limit', 'include'].includes(key)) {
                whereClause[key] = parsedData[key];
            }
        });
        
        const residents = await prisma.nHANKHAU.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: whereClause,
            include: include ? {
                HOKHAU: {
                    select: {
                        MAHOKHAU: true,
                        MAPHONG: true,
                        DIACHI: true,
                        LOAICANHO: true
                    }
                }
            } : undefined,
            orderBy: {
                MANHANKHAU: 'desc'
            }
        });
        
        const count = await prisma.nHANKHAU.count({
            where: whereClause
        });

        return {residents, count}
    } catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
                throw { status: 404, message: 'User not found' }
            }
                throw { status: 500, message: error.message }
    }


}
module.exports = {
    createResident,
    getResById,
    deleteResident,
    updateResident,
    getResidents
}