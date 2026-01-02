const { prisma } = require("../config/database")

const apartmentDataParse = (data) => {
  try {
    const parsed = { ...data }
    if ("MAHOKHAU" in parsed) parsed.MAHOKHAU = parseInt(parsed.MAHOKHAU, 10)
    if ("IDCHUHO" in parsed && parsed.IDCHUHO !== null) 
      {
        parsed.IDCHUHO = parseInt(parsed.IDCHUHO, 10)
      }
    if ("XEMAY" in parsed) parsed.XEMAY = parseInt(parsed.XEMAY, 10)
    if ("OTO" in parsed) parsed.OTO = parseInt(parsed.OTO, 10)

    if ("NGAYTAO" in parsed && parsed.NGAYTAO)
      parsed.NGAYTAO = new Date(parsed.NGAYTAO)

    if ("TRANGTHAI" in parsed)
      parsed.TRANGTHAI = parsed.TRANGTHAI === true || parsed.TRANGTHAI === 'true'
    
    if ("ACTIVATE" in parsed)
      parsed.ACTIVATE = parsed.ACTIVATE === true || parsed.ACTIVATE === 'true'

    return parsed
  } catch (error) {
    throw { status: 500, message: error.message }
  }
}


const chuyenHoKhau = async (idHoKhau, idChuHoMoi) => {
  try{
    const newOwner = await prisma.nHANKHAU.findFirst({
      MANHANKHAU:idChuHoMoi, ACTIVATE:true
    });
    if (!newOwner){
        throw { status: 400, message: 'Chủ hộ không tồn tại hoặc chưa được kích hoạt' };
      }
    const hoKhau = await prisma.hOKHAU.findFirst({
      MAHOKHAU:idHoKhau, ACTIVATE:true
    })
    if(!hoKhau){
      throw {status: 400, message: "Hộ khẩu không tồn tại hoặc đã bị xóa"}
    }
    else if (hoKhau.IDCHUHO != null){
      throw {status: 500, message: "Để chuyển chủ hộ cần thực hiện xóa hộ khẩu cũ, tạo hỗ khẩu mới"}
    }
    const result = await prisma.hOKHAU.update({
      where:{
        MAHOKHAU:idHoKhau
      },
      data:{
        IDCHUHO:idChuHoMoi
      }
    });
    return result
  }
  catch(error){
    throw error
  }
} 
// 1. Tạo mới hộ khẩu
const createApartment = async (data) => {
  try {
    let newApartment
    // Lưu ý: IDCHUHO bắt buộc phải tồn tại trong bảng NHANKHAU trước
    if (data.IDCHUHO){
      const idchuho = parseInt(data.IDCHUHO)
      const owner = await prisma.nHANKHAU.findFirst({
        where:{MANHANKHAU:idchuho, ACTIVATE:true}
      })
      if (!owner){
        throw { status: 400, message: 'Chủ hộ không tồn tại hoặc chưa được kích hoạt' };
      }
      const result = await prisma.hOKHAU.create({data: apartmentDataParse(data)});
       
      newApartment = result

    }
    else{
      newApartment = await prisma.hOKHAU.create({
      data: apartmentDataParse(data)
    })
    }
    
    return { newApartment }
  } catch (error) {
    // Lỗi vi phạm khóa ngoại (P2003) thường gặp khi IDCHUHO không tồn tại
    if (error.code === 'P2003') {
       throw { status: 400, message: 'Invalid Owner ID' }
    }
    throw { status: 500, message: error.message }
  }
}

// 2. Lấy hộ khẩu theo ID
const getApartmentById = async (id, include=false) => {
  try {
    const where = {
      MAHOKHAU:  parseInt(id)
      ,
    }
    // Có thể include thêm thông tin Chủ hộ để hiển thị chi tiết hơn
    const apartment = await prisma.hOKHAU.findFirst({ 
        where,
        include:include ?  {
            THONGTINCHUHO: true, // Include thông tin chủ hộ
            PHICODINH: true
        }:undefined
    })
    
    if (!apartment) {
        throw { status: 404, message: 'Apartment not found' }
    }

    return { apartment }
  } catch (error) {
    if (error.code === 'P2003') {
       throw { status: 400, message: 'Id chủ nhà không hợp lệ' }
    }
    throw { status: 500, message: error.message }
  }
}

// 3. Xóa hộ khẩu (Soft Delete - Chuyển ACTIVATE thành false)
const deleteApartment = async (id) => {
  try {
    const hokhau = parseInt(id)

    const where = {
      MAHOKHAU: parseInt(id)

    }
    const data = {
      ACTIVATE: false
    }
    const result = await prisma.$transaction(async (prisma) => {
      const nhankhauList = await prisma.nHANKHAU.findMany({
        where:{MAHOKHAU:hokhau}
      })
      const apt = await prisma.hOKHAU.update({
        where:{MAHOKHAU:hokhau},
        data:{ACTIVATE:false,
          NGAYKETTHUC:new Date()}
      })
      if(nhankhauList.length > 0){
        const historyData = nhankhauList.map((person) => ({
        MANHANKHAU: person.MANHANKHAU,
        MAHOKHAU: hokhau,              
        LOAITHAYDOI: 'XOA_HO_KHAU',   
        CHUCVU_CU: person.QUANHEVOICHUHO,
        GHI_CHU: 'Hộ khẩu bị xóa',
        NGAYBATDAU:apt.NGAYTAO,
        NGAYKETTHUC: new Date()   
      }))
        await prisma.lICHSU_CUTRU.createMany({
          data:historyData
        })
      }
      await prisma.nHANKHAU.updateMany({
        where:{MAHOKHAU:hokhau},
        data:{MAHOKHAU:null,QUANHEVOICHUHO: null}
      })
      
      return apt
      
    })
    return { deleteApt: result }
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Apartment not found' }
    }
    throw { status: 500, message: error.message }
  }
}

// 4. Cập nhật thông tin hộ khẩu
const updateApartment = async (id, data) => {
  try {
    let updateApt
    const mahokhau = parseInt(id)
    
    if (data.IDCHUHO){
      await chuyenHoKhau(mahokhau, parseInt(data.IDCHUHO))
      delete data.IDCHUHO
    }
    updateApt = await prisma.hOKHAU.update({ 
        where:{
          MAHOKHAU:mahokhau
        }, 
        data: apartmentDataParse(data) 
    })
    return { updateApt }
  } catch (error) {
    if (error.code === 'P2025') {
      throw { status: 404, message: 'Apartment not found' }
    }
    throw { status: 500, message: error.message }
  }
}

// 5. Lấy danh sách hộ khẩu (có phân trang & lọc)
const getApartments = async (data, page = 1, limit = 10,include=false) => {
  try {
    // Xử lý filter data trước khi đưa vào query
    const filter = apartmentDataParse(data)

    const apartments = await prisma.hOKHAU.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: filter,
      include:include ? {
        THONGTINCHUHO: {
            select: { HOTEN: true, SOCANCUOC: true }
        },
        PHICODINH: true
      }:undefined
    })

    const count = await prisma.hOKHAU.count({
      where: filter
    })

    return { apartments, count }
  } catch (error) {
    throw { status: 500, message: error.message }
  }
}

module.exports = {
  createApartment,
  getApartmentById,
  deleteApartment,
  updateApartment,
  getApartments
}