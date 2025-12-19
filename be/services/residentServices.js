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

const createResident = async(data) => {
    try{
        const newRes = await prisma.nHANKHAU.create({
            data:resDataParse(data)
        })
        return {newRes};
    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
                throw { status: 404, message: 'User not found' }
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
    try{
        const where = {
            MANHANKHAU:{
                equals:parseInt(id)
            }
        };
        data = {
            ACTIVE:{
                equals:false
            }
        }
        const deleteRes = prisma.nHANKHAU.update({where, data});
        return {deleteRes}
    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
                throw { status: 404, message: 'User not found' }
            }
                throw { status: 500, message: error.message }
    }
}
const updateResident = async (id,data) => {
    try{
        const where={
            MANHANKHAU:{
                equals:parseInt(id)
            }
        }
        const updateRes = prisma.nHANKHAU.update({where, data:resDataParse(data)});
        return {updateRes};
    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
                throw { status: 404, message: 'User not found' }
            }
                throw { status: 500, message: error.message }
    }
}

const getResidents = async (data, page=1, limit = 10,include = false) => {
    try{
        const residents =  await prisma.nHANKHAU.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where:resDataParse(data),
            include:include ? {
                    HOKHAU:{
                        select:{
                            MAHOKHAU:true,
                            MAPHONG:true,
                        }
                    }
                } : undefined
        })
        const count = await prisma.nHANKHAU.count({
                skip: (page - 1) * limit,
                take: limit,
                where:resDataParse(data),
                
            })
        

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