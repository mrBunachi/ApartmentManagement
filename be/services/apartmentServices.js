const { prisma } = require("../config/database")

// Helper: Parse dữ liệu đầu vào cho đúng kiểu dữ liệu của Prisma
const apartmentDataParse = (data) => {
  try {
    const parsed = { ...data }
    // Parse các trường số nguyên
    if ("MAHOKHAU" in parsed) parsed.MAHOKHAU = parseInt(parsed.MAHOKHAU, 10)
    if ("IDCHUHO" in parsed && parsed.IDCHUHO !== null) 
      {
        parsed.IDCHUHO = parseInt(parsed.IDCHUHO, 10)
      }
    if ("XEMAY" in parsed) parsed.XEMAY = parseInt(parsed.XEMAY, 10)
    if ("OTO" in parsed) parsed.OTO = parseInt(parsed.OTO, 10)

    // Parse ngày tháng
    if ("NGAYTAO" in parsed && parsed.NGAYTAO)
      parsed.NGAYTAO = new Date(parsed.NGAYTAO)

    // Parse Boolean (xử lý trường hợp gửi string 'true'/'false' từ frontend)
    if ("TRANGTHAI" in parsed)
      parsed.TRANGTHAI = parsed.TRANGTHAI === true || parsed.TRANGTHAI === 'true'
    
    if ("ACTIVATE" in parsed)
      parsed.ACTIVATE = parsed.ACTIVATE === true || parsed.ACTIVATE === 'true'

    return parsed
  } catch (error) {
    throw { status: 500, message: error.message }
  }
}

// 1. Tạo mới hộ khẩu
const createApartment = async (data) => {
  try {
    // Lưu ý: IDCHUHO bắt buộc phải tồn tại trong bảng NHANKHAU trước
    const newApartment = await prisma.hOKHAU.create({
      data: apartmentDataParse(data)
    })
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
    const where = {
      MAHOKHAU: parseInt(id)

    }
    // Theo schema của bạn là ACTIVATE chứ không phải ACTIVE
    const data = {
      ACTIVATE: false
    }
    const deleteApt = await prisma.hOKHAU.delete({where})
    return { deleteApt }
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
    const where = {
      MAHOKHAU:parseInt(id)
     
    }
    const updateApt = await prisma.hOKHAU.update({ 
        where, 
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
        THONGTINCHUHO: { // Lấy tên chủ hộ
            select: { HOTEN: true, SOCANCUOC: true }
        },
        PHICODINH: true
      }:undefined
    })

    const count = await prisma.hOKHAU.count({
      skip: (page - 1) * limit,
      take: limit,
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