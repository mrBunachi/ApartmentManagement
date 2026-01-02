const { prisma } = require("../config/database");

const getFeeListByDotThu = async (maDotThu) => {
  try {
    const maDotThuInt = parseInt(maDotThu);

    // 1. Lấy danh sách tổng hợp từ bảng DANHSACHTHUPHI
    const list = await prisma.dANHSACHTHUPHI.findMany({
      where: {
        MADOTTHU: maDotThuInt,
      },
      include: {
        // Thông tin đợt thu (để object có cấu trúc giống API kia)
        DOTTHUPHI: {
            select: {
                MADOTTHU: true,
                TEN: true,
                NGAYTAO: true
            }
        },
        // Thông tin Hộ khẩu & Chủ hộ
        HOKHAU: {
          select: {
            IDCHUHO: true,
            MAPHONG: true,
            LOAICANHO: true,
            THONGTINCHUHO: { // Lấy thêm thông tin chủ hộ
              select: { 
                  HOTEN: true, 
              } 
            }
          }
        }
      },
      orderBy: {
        MAHOKHAU: 'asc',
      },
    });

    // 2. Lấy chi tiết chỉ số điện nước (PHITHUHO) của đợt này
    const details = await prisma.pHITHUHO.findMany({
        where: { MADOTTHU: maDotThuInt }
    });

    // 3. Gộp dữ liệu (Merge)
    const finalResult = list.map(item => {
        // Tìm bản ghi chi tiết tương ứng với hộ này
        const detail = details.find(d => d.MAHOKHAU === item.MAHOKHAU);
        
        return {
            ...item,
            PHITHUHO: detail || null // Thêm trường chi tiết giống API kia
        };
    });

    return finalResult;

  } catch (error) {
    throw { status: 500, message: error.message };
  }
};


const getFeeDetail = async (maDotThu, maHoKhau) => {
    try {
        const maDotThuInt = parseInt(maDotThu);
        const maHoKhauInt = parseInt(maHoKhau);

        // 1. Lấy thông tin từ bảng DANHSACHTHUPHI kèm các quan hệ
        const item = await prisma.dANHSACHTHUPHI.findUnique({
            where: {
                MADOTTHU_MAHOKHAU: {
                    MADOTTHU: maDotThuInt,
                    MAHOKHAU: maHoKhauInt
                }
            },
            include: {
                // Include thông tin Đợt thu
                DOTTHUPHI: {
                    select: {
                        MADOTTHU: true,
                        TEN: true,
                        NGAYTAO: true,
                        MOTA: true
                    }
                },
                // Include thông tin Hộ khẩu & Chủ hộ
                HOKHAU: {
                    select: {
                        MAPHONG: true,
                        LOAICANHO: true,
                        THONGTINCHUHO: { 
                            select: { 
                                HOTEN: true, 
                            } 
                        }
                    }
                }
            }
        });

        if (!item) throw { status: 404, message: "Không tìm thấy thông tin thu phí" };

        // 2. Lấy chi tiết chỉ số điện nước từ bảng PHITHUHO
        const detail = await prisma.pHITHUHO.findUnique({
            where: {
                 MADOTTHU_MAHOKHAU: {
                    MADOTTHU: maDotThuInt,
                    MAHOKHAU: maHoKhauInt
                }
            }
        });

        // 3. Trả về kết quả đã gộp (Merge)
        return { 
            ...item, 
            PHITHUHO: detail || null 
        };

    } catch (error) {
        throw { status: error.status || 500, message: error.message };
    }
}

const updatePaymentStatus = async (maDotThu, maHoKhau, amount, phuongThuc = "Tiền mặt") => {
    try {
        // 1. Lấy thông tin hiện tại
        const currentBill = await prisma.dANHSACHTHUPHI.findUnique({
             where: {
                MADOTTHU_MAHOKHAU: {
                    MADOTTHU: parseInt(maDotThu),
                    MAHOKHAU: parseInt(maHoKhau)
                }
            }
        });

        if(!currentBill) throw { status: 404, message: "Không tìm thấy hóa đơn" };

        const totalRequired = 
            (parseFloat(currentBill.TIENNHA || 0)) +
            (parseFloat(currentBill.TIENDICHVU || 0)) +
            (parseFloat(currentBill.TIENXEMAY || 0)) +
            (parseFloat(currentBill.TIENOTO || 0)) +
            (parseFloat(currentBill.TIENDIEN || 0)) +
            (parseFloat(currentBill.TIENNUOC || 0)) +
            (parseFloat(currentBill.TIENINTERNET || 0));
        
        const newPaidAmount = parseFloat(amount);
        
        const isPaid = newPaidAmount >= totalRequired;

        const updated = await prisma.dANHSACHTHUPHI.update({
            where: {
                MADOTTHU_MAHOKHAU: {
                    MADOTTHU: parseInt(maDotThu),
                    MAHOKHAU: parseInt(maHoKhau)
                }
            },
            data: {
                SOTIENDADONG: newPaidAmount,
                NGAYDONG: new Date(),
                HINHTHUC: phuongThuc,
                TRANGTHAI: isPaid
            }
        });

        return updated;

    } catch (error) {
        throw { status: error.status || 500, message: error.message };
    }
}

const getUnpaidFeeListByHousehold = async (maHoKhau) => {
  try {
    const maHoKhauInt = parseInt(maHoKhau);

    // 1. Lấy danh sách các khoản chưa đóng từ bảng DANHSACHTHUPHI
    const list = await prisma.dANHSACHTHUPHI.findMany({
      where: {
        MAHOKHAU: maHoKhauInt,
        TRANGTHAI: false, // Chỉ lấy khoản chưa đóng
      },
      include: {
        // Lấy thông tin đợt thu
        DOTTHUPHI: {
          select: { 
            MADOTTHU: true, 
            TEN: true, 
            NGAYTAO: true,
            MOTA: true
          }
        },
        // Lấy thông tin Hộ khẩu & Chủ hộ
        HOKHAU: {
          select: {
            MAPHONG: true,
            LOAICANHO: true,
            THONGTINCHUHO: { // Include thông tin chủ hộ từ bảng NHANKHAU
                select: {
                    HOTEN: true,
                }
            }
          }
        }
      },
      orderBy: {
        DOTTHUPHI: {
            NGAYTAO: 'desc' // Đợt mới nhất lên đầu
        }
      }
    });

    // 2. Lấy chi tiết chỉ số điện nước (PHITHUHO) tương ứng với các đợt thu tìm được
    // Lấy ra danh sách các Mã đợt thu từ kết quả trên
    const listMaDotThu = list.map(item => item.MADOTTHU);

    // Query bảng PHITHUHO
    const details = await prisma.pHITHUHO.findMany({
        where: {
            MAHOKHAU: maHoKhauInt,
            MADOTTHU: { in: listMaDotThu } // Chỉ lấy của các đợt có trong list chưa đóng
        }
    });

    // 3. Gộp dữ liệu (Merge)
    // Ghép object chi tiết vào từng item của danh sách chính
    const finalResult = list.map(item => {
        // Tìm bản ghi chi tiết tương ứng với đợt thu này
        const detail = details.find(d => d.MADOTTHU === item.MADOTTHU);
        
        return {
            ...item,
            PHITHUHO: detail || null // Thêm trường mới chứa chi tiết điện nước
        };
    });

    return finalResult;

  } catch (error) {
    throw { status: 500, message: error.message };
  }
};

module.exports = {
  getFeeListByDotThu,
  getFeeDetail,
  updatePaymentStatus,
  getUnpaidFeeListByHousehold
};