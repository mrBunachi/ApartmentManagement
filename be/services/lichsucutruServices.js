const { prisma } = require("../config/database");
// Helper: Parse dữ liệu lịch sử cư trú cho đúng kiểu dữ liệu của Prisma
const historyDataParse = (data) => {
  try {
    const parsed = { ...data }

    // 1. Parse các trường số nguyên (Int)
    // Bao gồm: ID, MANHANKHAU, MAHOKHAU
    const intFields = ["ID", "MANHANKHAU", "MAHOKHAU"];
    intFields.forEach((field) => {
      if (field in parsed && parsed[field] !== null && parsed[field] !== "") {
        parsed[field] = parseInt(parsed[field], 10);
      }
    });

    // 2. Parse ngày tháng (DateTime)
    if ("NGAYBATDAU" in parsed && parsed.NGAYBATDAU)
      parsed.NGAYBATDAU = new Date(parsed.NGAYBATDAU)

    if ("NGAYKETTHUC" in parsed && parsed.NGAYKETTHUC)
      parsed.NGAYKETTHUC = new Date(parsed.NGAYKETTHUC)

    // 3. Filter theo MAPHONG (String - không cần parse)
    // MAPHONG, LOAITHAYDOI, CHUCVU_CU, GHI_CHU giữ nguyên giá trị string

    return parsed
  } catch (error) {
    throw { status: 500, message: error.message }
  }
}



const getHistories = async (data, page = 1, limit = 10,include=false) =>{ 
    try{
        const filter = historyDataParse(data);
        const hisData = await prisma.lICHSU_CUTRU.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: filter,
            include: include ? {
                NHANKHAU:{
                    select: {HOTEN: true, MANHANKHAU:true, MAHOKHAU:true, SOCANCUOC: true, NGAYSINH: true}
                },
                HOKHAU:{
                    select: {MAHOKHAU:true, IDCHUHO:true, MAPHONG: true, LOAICANHO: true, DIACHI: true, MAPHONG: true}
                }
            }:undefined
        })
        const countHisData = await prisma.lICHSU_CUTRU.count({
            where:filter
        })
        return {hisData, countHisData}
    }
    catch(error){
        throw error
    }
}
const gethistoryById = async(id, include=false) => {
    try{
        const hisData = await prisma.lICHSU_CUTRU.findFirst({
            where:{
                ID:parseInt(id)
            },
            include: include ? {
                NHANKHAU,
                HOKHAU
            }: undefined
        })
        if (!hisData) {
            throw { status: 404, message: 'Không có lịch sử cư trú này' }
        }
        return {hisData}
    
    }
    catch(error){
        throw error
    }
}

module.exports = {
    getHistories,
    gethistoryById
}