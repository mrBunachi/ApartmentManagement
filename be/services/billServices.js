const { prisma } = require("../config/database");

const processOneBill = async (maDotThu, data) => {
  const { 
    MAHOKHAU, SODIEN, SONUOC, DONGIADIEN, DONGIANUOC, TIENINTERNET = 0 
  } = data;

  const hoKhau = await prisma.HOKHAU.findUnique({
    where: { MAHOKHAU: parseInt(MAHOKHAU) },
    include: { PHICODINH: true }
  });

  if (!hoKhau) throw { status: 404, message: `Hộ khẩu ${MAHOKHAU} không tồn tại` };
  if (!hoKhau.PHICODINH) throw { status: 400, message: `Hộ khẩu ${MAHOKHAU} chưa cấu hình phí cố định` };

  const phiCoDinh = hoKhau.PHICODINH;
  
  // Tính toán
  const tienDien = parseFloat(SODIEN) * parseFloat(DONGIADIEN);
  const tienNuoc = parseFloat(SONUOC) * parseFloat(DONGIANUOC);
  const tienDichVu = parseFloat(phiCoDinh.PHIQLCHUNGCU || 0);
  const tienNha = parseFloat(phiCoDinh.GIATIENCANHO || 0);
  const tienXeMay = (hoKhau.XEMAY || 0) * parseFloat(phiCoDinh.PHIXEMAY || 0);
  const tienOto = (hoKhau.OTO || 0) * parseFloat(phiCoDinh.PHIXEOTO || 0);

  // Transaction lưu DB
  return await prisma.$transaction(async (tx) => {
    // 1. Lưu chi tiết chỉ số (PHITHUHO)
    const phiThuHo = await tx.PHITHUHO.upsert({
      where: {
        MADOTTHU_MAHOKHAU: { MADOTTHU: parseInt(maDotThu), MAHOKHAU: parseInt(MAHOKHAU) }
      },
      update: {
        TONGDIEN: SODIEN, DONGIADIEN: DONGIADIEN, TONGTIENDIEN: tienDien,
        TONGNUOC: SONUOC, DONGIANUOC: DONGIANUOC, TONGTIENNUOC: tienNuoc,
        THANHTIENNUOC: tienNuoc, THANHTIENINTERNET: TIENINTERNET
      },
      create: {
        MADOTTHU: parseInt(maDotThu), MAHOKHAU: parseInt(MAHOKHAU),
        TONGDIEN: SODIEN, DONGIADIEN: DONGIADIEN, TONGTIENDIEN: tienDien,
        TONGNUOC: SONUOC, DONGIANUOC: DONGIANUOC, TONGTIENNUOC: tienNuoc,
        THANHTIENNUOC: tienNuoc, THANHTIENINTERNET: TIENINTERNET
      }
    });

    // 2. Lưu tổng hợp (DANHSACHTHUPHI)
    const danhSachThuPhi = await tx.DANHSACHTHUPHI.upsert({
      where: {
        MADOTTHU_MAHOKHAU: { MADOTTHU: parseInt(maDotThu), MAHOKHAU: parseInt(MAHOKHAU) }
      },
      update: {
        SODIEN: SODIEN, TIENDIEN: tienDien,
        SONUOC: SONUOC, TIENNUOC: tienNuoc,
        TIENINTERNET: TIENINTERNET,
        TIENNHA: tienNha, TIENDICHVU: tienDichVu,
        TIENXEMAY: tienXeMay, TIENOTO: tienOto,
        TRANGTHAI: false 
      },
      create: {
        MADOTTHU: parseInt(maDotThu), MAHOKHAU: parseInt(MAHOKHAU),
        SODIEN: SODIEN, TIENDIEN: tienDien,
        SONUOC: SONUOC, TIENNUOC: tienNuoc,
        TIENINTERNET: TIENINTERNET,
        TIENNHA: tienNha, TIENDICHVU: tienDichVu,
        TIENXEMAY: tienXeMay, TIENOTO: tienOto,
        TRANGTHAI: false
      }
    });

    return { phiThuHo, danhSachThuPhi };
  });
};

/**
 * LOGIC NỘI BỘ: Xử lý tạo 1 phiếu đóng góp
 */
const processOneContribution = async (maDotThu, data) => {
  const { MAHOKHAU, MALOAIPHI, SOTIEN, HINHTHUC = "Tiền mặt", GHICHU = "" } = data;

  const hoKhau = await prisma.HOKHAU.findUnique({ where: { MAHOKHAU: parseInt(MAHOKHAU) } });
  if (!hoKhau) throw { status: 404, message: `Hộ khẩu ${MAHOKHAU} không tồn tại` };

  const loaiPhi = await prisma.lOAIPHI.findUnique({ where: { MALOAIPHI: parseInt(MALOAIPHI) } });
  if (!loaiPhi) throw { status: 404, message: `Loại phí ${MALOAIPHI} không tồn tại` };

  return await prisma.dONGGOP.create({
    data: {
      MADOTTHU: parseInt(maDotThu),
      MAHOKHAU: parseInt(MAHOKHAU),
      MALOAIPHI: parseInt(MALOAIPHI),
      SOTIENDADONG: parseFloat(SOTIEN),
      NGAYDONG: new Date(),
      HINHTHUC: HINHTHUC,
      TRANGTHAI: true,
      GHICHU: GHICHU,
      TENDONGTIEN: "VND"
    },
    include: {
      LOAIPHI: { select: { TEN: true } },
      HOKHAU: { select: { MAPHONG: true } }
    }
  });
};


/**
 * 1. Tạo Hóa Đơn (Điện/Nước/Dịch vụ) - Hỗ trợ Single hoặc Bulk
 * Yêu cầu: Đợt thu phải có BATBUOC = true
 */
const createBill = async (maDotThu, data) => {
  try {
    // Validate Đợt thu phí
    const dotThu = await prisma.dOTTHUPHI.findUnique({ where: { MADOTTHU: parseInt(maDotThu) } });
    if (!dotThu) throw { status: 404, message: 'Đợt thu phí không tồn tại' };
    
    // KIỂM TRA QUAN TRỌNG: Phải là đợt thu bắt buộc
    if (dotThu.BATBUOC === false) {
      throw { status: 400, message: 'Đợt này là vận động đóng góp (tự nguyện). Vui lòng dùng API tạo phiếu đóng góp.' };
    }

    // Xử lý Hàng loạt (Bulk)
    if (Array.isArray(data)) {
      const results = { success: [], errors: [] };
      for (const item of data) {
        try {
          await processOneBill(maDotThu, item);
          results.success.push({ MAHOKHAU: item.MAHOKHAU, status: "OK" });
        } catch (error) {
          results.errors.push({ MAHOKHAU: item.MAHOKHAU, message: error.message });
        }
      }
      return results;
    } 
    
    // Xử lý Đơn lẻ (Single)
    else {
      return await processOneBill(maDotThu, data);
    }
  } catch (error) {
    throw { status: error.status || 500, message: error.message };
  }
};

/**
 * 2. Tạo Phiếu Đóng Góp (Tự nguyện) - Hỗ trợ Single hoặc Bulk
 * Yêu cầu: Đợt thu phải có BATBUOC = false
 */
const createContributionBill = async (maDotThu, data) => {
  try {
    // Validate Đợt thu phí
    const dotThu = await prisma.dOTTHUPHI.findUnique({ where: { MADOTTHU: parseInt(maDotThu) } });
    if (!dotThu) throw { status: 404, message: 'Đợt thu không tồn tại' };

    // KIỂM TRA QUAN TRỌNG: Phải là đợt vận động tự nguyện
    if (dotThu.BATBUOC === true) {
      throw { status: 400, message: 'Đợt này là thu phí bắt buộc (Điện/Nước). Vui lòng dùng API tạo hóa đơn điện nước.' };
    }

    // Xử lý Hàng loạt (Bulk)
    if (Array.isArray(data)) {
      const results = { success: [], errors: [] };
      for (const item of data) {
        try {
          await processOneContribution(maDotThu, item);
          results.success.push({ MAHOKHAU: item.MAHOKHAU, status: "OK" });
        } catch (error) {
          results.errors.push({ MAHOKHAU: item.MAHOKHAU, message: error.message });
        }
      }
      return results;
    } 
    
    // Xử lý Đơn lẻ (Single)
    else {
      return await processOneContribution(maDotThu, data);
    }
  } catch (error) {
    throw { status: error.status || 500, message: error.message };
  }
};

module.exports = {
  createBill,
  createContributionBill
};