const { prisma } = require("../config/database");

const generateBill = async (dotThuPhiData, adminId) => {
    try {
        // Tạo đợt thu phí mới
        const newDotThuPhi = await prisma.dOTTHUPHI.create({
            data: {
                TEN: dotThuPhiData.TEN,
                MOTA: dotThuPhiData.MOTA,
                NGUOIQUANLYId: adminId,
                // BATBUOC: true (mặc định)
            }
        });

        // Lấy tất cả hộ khẩu đang hoạt động và phí cố định của họ
        const activeHouseholds = await prisma.hOKHAU.findMany({
            where: { ACTIVATE: true },
            include: {
                PHICODINH: true // Include để lấy thông tin phí cố định
            }
        });

        // Tạo bill nháp cho từng hộ
        const draftBills = activeHouseholds.map(hoKhau => {
            const phiXeMay = (hoKhau.XEMAY || 0) * (hoKhau.PHICODINH.PHIXEMAY || 0); // Giả sử PHICODINH có PHIXEMAY
            const phiOto = (hoKhau.OTO || 0) * (hoKhau.PHICODINH.PHIXEOTO || 0);

            return {
                MADOTTHU: newDotThuPhi.MADOTTHU,
                MAHOKHAU: hoKhau.MAHOKHAU,
                // Các khoản phí cố định
                TIENNHA: hoKhau.PHICODINH.GIATIENCANHO,
                TIENDICHVU: hoKhau.PHICODINH.PHIQLCHUNGCU,
                TIENXEMAY: phiXeMay,
                TIENOTO: phiOto,
                TIENINTERNET: 0, // Cần logic để lấy phí này
                
                // Các khoản phí biến đổi (chờ admin nhập)
                SODIEN: 0,
                SONUOC: 0,
                
                // Trạng thái
                TRANGTHAI: "Chờ cập nhật số", // Trạng thái mới
                SOTIENDADONG: 0
            };
        });

        // Lưu tất cả bill nháp vào CSDL
        await prisma.dANHSACHTHUPHI.createMany({
            data: draftBills
        });

        return newDotThuPhi;
    } catch (error) {
        throw error;
    }
}


const updateConsumption = async (dotThuId, updates) => {
    try {
        // Dùng transaction để đảm bảo tất cả cùng thành công hoặc thất bại
        const updatePromises = updates.map(async (update) => {
            
            // Tính toán tiền điện, nước
            const tienDien = (update.SODIEN || 0) * GIA_DIEN_MOI_KWH;
            const tienNuoc = (update.SONUOC || 0) * GIA_NUOC_MOI_KHOI;

            // Lấy bill nháp hiện tại để cộng dồn
            const currentBill = await prisma.dANHSACHTHUPHI.findUnique({
                where: {
                    MADOTTHU_MAHOKHAU: {
                        MADOTTHU: dotThuId,
                        MAHOKHAU: update.MAHOKHAU
                    }
                },
                select: { TIENNHA: true, TIENDICHVU: true, TIENXEMAY: true, TIENOTO: true, TIENINTERNET: true }
            });

            if (!currentBill) {
                throw new Error(`Không tìm thấy bill cho hộ ${update.MAHOKHAU}`);
            }

            // Tính tổng (cần một trường TONGTIEN trong schema DANHSACHTHUPHI)
            // const tongTien = (currentBill.TIENNHA || 0) + (currentBill.TIENDICHVU || 0) + ... + tienDien + tienNuoc;

            return prisma.dANHSACHTHUPHI.update({
                where: {
                    MADOTTHU_MAHOKHAU: {
                        MADOTTHU: dotThuId,
                        MAHOKHAU: update.MAHOKHAU
                    }
                },
                data: {
                    SODIEN: update.SODIEN,
                    SONUOC: update.SONUOC,
                    // Cập nhật các trường tính toán
                    TENDIEN: "Điện sinh hoạt", // Cập nhật tên
                    TENNUOC: "Nước sinh hoạt", // Cập nhật tên
                    // TONGTIENDIEN: tienDien, // Schema của bạn không có trường này
                    // TONGTIENNUOC: tienNuoc, // Schema của bạn không có trường này
                    // TONGTIEN: tongTien, // Cần thêm trường này vào schema
                    TRANGTHAI: "Chưa thanh toán" // Chuyển trạng thái
                }
            });
        });

        // Chạy tất cả các lệnh cập nhật trong một transaction
        await prisma.$transaction(updatePromises);

    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateBill,
    updateConsumption 
};