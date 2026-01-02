const { prisma } = require("../config/database");


const getAllPhiThuHo = async (maDotThu) => {
  try {
    const where = {};
    if (maDotThu) where.MADOTTHU = parseInt(maDotThu);

    const data = await prisma.pHITHUHO.findMany({
      where: where,
      include: {
        HOKHAU: {
          select: {
            MAPHONG: true,
            THONGTINCHUHO: { select: { HOTEN: true } }
          }
        }
      }
    });
    return data;
  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

const updatePhiThuHo = async (madotthu, mahokhau, data) => {
  try {
    // 1. Validate đầu vào
    const maDotThuInt = parseInt(madotthu);
    const maHoKhauInt = parseInt(mahokhau);
    
    // Lấy thông tin cũ để giữ lại đơn giá nếu không gửi lên
    const currentData = await prisma.pHITHUHO.findUnique({
        where: { MADOTTHU_MAHOKHAU: { MADOTTHU: maDotThuInt, MAHOKHAU: maHoKhauInt } }
    });

    if (!currentData) throw { status: 404, message: "Không tìm thấy dữ liệu phí thu hộ" };

    // 2. Tính toán lại tiền điện/nước nếu có thay đổi chỉ số
    const soDien = data.TONGDIEN !== undefined ? parseFloat(data.TONGDIEN) : parseFloat(currentData.TONGDIEN || 0);
    const donGiaDien = data.DONGIADIEN !== undefined ? parseFloat(data.DONGIADIEN) : parseFloat(currentData.DONGIADIEN || 0);
    
    const soNuoc = data.TONGNUOC !== undefined ? parseFloat(data.TONGNUOC) : parseFloat(currentData.TONGNUOC || 0);
    const donGiaNuoc = data.DONGIANUOC !== undefined ? parseFloat(data.DONGIANUOC) : parseFloat(currentData.DONGIANUOC || 0);

    const tienInternet = data.TIENINTERNET !== undefined ? parseFloat(data.TIENINTERNET) : parseFloat(currentData.THANHTIENINTERNET || 0);

    const thanhTienDien = soDien * donGiaDien;
    const thanhTienNuoc = soNuoc * donGiaNuoc;

    // 3. Thực hiện Transaction để update cả 2 bảng
    const result = await prisma.$transaction(async (tx) => {
        // Update bảng chi tiết PHITHUHO
        const updatedPhiThuHo = await tx.pHITHUHO.update({
            where: {
                MADOTTHU_MAHOKHAU: { MADOTTHU: maDotThuInt, MAHOKHAU: maHoKhauInt }
            },
            data: {
                TONGDIEN: soDien,
                DONGIADIEN: donGiaDien,
                TONGTIENDIEN: thanhTienDien,
                
                TONGNUOC: soNuoc,
                DONGIANUOC: donGiaNuoc,
                TONGTIENNUOC: thanhTienNuoc,
                THANHTIENNUOC: thanhTienNuoc,

                THANHTIENINTERNET: tienInternet // <--- Cập nhật tiền Internet
            }
        });

        // Update bảng tổng hợp DANHSACHTHUPHI để khớp số liệu
        await tx.dANHSACHTHUPHI.update({
            where: {
                MADOTTHU_MAHOKHAU: { MADOTTHU: maDotThuInt, MAHOKHAU: maHoKhauInt }
            },
            data: {
                SODIEN: soDien,
                TIENDIEN: thanhTienDien,
                SONUOC: soNuoc,
                TIENNUOC: thanhTienNuoc,
                TIENINTERNET: tienInternet, // <--- Đồng bộ sang bảng tổng
                
                // Nếu sửa tiền thì reset trạng thái về chưa đóng (để tránh trường hợp đóng rồi nhưng sửa bill tăng tiền)
                TRANGTHAI: false 
            }
        });

        return updatedPhiThuHo;
    });

    return result;

  } catch (error) {
    if (error.code === 'P2025') throw { status: 404, message: "Bản ghi không tồn tại" };
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  getAllPhiThuHo,
  updatePhiThuHo
};