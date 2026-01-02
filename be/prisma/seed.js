const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed database...\n');

//   // ============================================
//   // 1. XÓA DỮ LIỆU CŨ (theo thứ tự ngược)
//   // ============================================
//   console.log('🗑️  Xóa dữ liệu cũ...');
  
//   await prisma.lICHSU_CUTRU.deleteMany();
//   await prisma.tAMVANG.deleteMany();
//   await prisma.tAMTRU.deleteMany();
//   await prisma.pHITHUHO.deleteMany();
//   await prisma.dANHSACHTHUPHI.deleteMany();
//   await prisma.dONGGOP.deleteMany();
//   await prisma.lOAIPHI.deleteMany();
//   await prisma.dOTTHUPHI.deleteMany();
//   await prisma.nHANKHAU.deleteMany();
//   await prisma.hOKHAU.deleteMany();
//   await prisma.pHICODINH.deleteMany();
//   await prisma.nGUOIQUANLY.deleteMany();
  
//   console.log('✅ Đã xóa dữ liệu cũ\n');

  // ============================================
  // 2. TẠO QUẢN LÝ (ADMIN)
  // ============================================
  console.log('👤 Tạo tài khoản quản lý...');
  
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const admin1 = await prisma.nGUOIQUANLY.create({
    data: {
      TENDANGNHAP: 'admin',
      HOTEN: 'Nguyễn Văn Admin',
      MATKHAU: hashedPassword,
      SODIENTHOAI: '0123456789',
      EMAIL: 'admin@apartment.com',
      VAITRO: 'admin_1',
      ACTIVATE: true
    }
  });
  
  const admin2 = await prisma.nGUOIQUANLY.create({
    data: {
      TENDANGNHAP: 'banquanly',
      HOTEN: 'Trần Thị Quản Lý',
      MATKHAU: hashedPassword,
      SODIENTHOAI: '0987654321',
      EMAIL: 'banquanly@apartment.com',
      VAITRO: 'admin_2',
      ACTIVATE: true
    }
  });
  
  console.log(`✅ Đã tạo 2 quản lý: ${admin1.TENDANGNHAP}, ${admin2.TENDANGNHAP}\n`);

  // ============================================
  // 3. TẠO PHÍ CỐ ĐỊNH (LOẠI CĂN HỘ)
  // ============================================
  console.log('💰 Tạo bảng giá phí cố định...');
  
  const phiCaoCap = await prisma.pHICODINH.create({
    data: {
      LOAICANHO: 'Cao cấp',
      GIATIENCANHO: 5000000,
      PHIQLCHUNGCU: 300000,
      PHIXEMAY: 50000,
      PHIXEOTO: 400000
    }
  });
  
  const phiTrungBinh = await prisma.pHICODINH.create({
    data: {
      LOAICANHO: 'Trung bình',
      GIATIENCANHO: 3000000,
      PHIQLCHUNGCU: 200000,
      PHIXEMAY: 40000,
      PHIXEOTO: 300000
    }
  });
  
  const phiGiaRe = await prisma.pHICODINH.create({
    data: {
      LOAICANHO: 'Giá rẻ',
      GIATIENCANHO: 1500000,
      PHIQLCHUNGCU: 100000,
      PHIXEMAY: 30000,
      PHIXEOTO: 200000
    }
  });
  
  console.log(`✅ Đã tạo 3 loại căn hộ: Cao cấp, Trung bình, Giá rẻ\n`);

  // ============================================
  // 4. TẠO HỘ KHẨU (5 hộ)
  // ============================================
  console.log('🏠 Tạo hộ khẩu...');
  
  const hoKhau1 = await prisma.hOKHAU.create({
    data: {
      MAPHONG: 'A101',
      LOAICANHO: 'Cao cấp',
      DIACHI: 'Tầng 1, Block A, Chung cư ABC',
      XEMAY: 2,
      OTO: 1,
      ACTIVATE: true
    }
  });
  
  const hoKhau2 = await prisma.hOKHAU.create({
    data: {
      MAPHONG: 'A102',
      LOAICANHO: 'Cao cấp',
      DIACHI: 'Tầng 1, Block A, Chung cư ABC',
      XEMAY: 1,
      OTO: 1,
      ACTIVATE: true
    }
  });
  
  const hoKhau3 = await prisma.hOKHAU.create({
    data: {
      MAPHONG: 'B201',
      LOAICANHO: 'Trung bình',
      DIACHI: 'Tầng 2, Block B, Chung cư ABC',
      XEMAY: 3,
      OTO: 0,
      ACTIVATE: true
    }
  });
  
  const hoKhau4 = await prisma.hOKHAU.create({
    data: {
      MAPHONG: 'B202',
      LOAICANHO: 'Trung bình',
      DIACHI: 'Tầng 2, Block B, Chung cư ABC',
      XEMAY: 2,
      OTO: 0,
      ACTIVATE: true
    }
  });
  
  const hoKhau5 = await prisma.hOKHAU.create({
    data: {
      MAPHONG: 'C301',
      LOAICANHO: 'Giá rẻ',
      DIACHI: 'Tầng 3, Block C, Chung cư ABC',
      XEMAY: 1,
      OTO: 0,
      ACTIVATE: true
    }
  });
  
  console.log(`✅ Đã tạo 5 hộ khẩu: ${hoKhau1.MAPHONG}, ${hoKhau2.MAPHONG}, ${hoKhau3.MAPHONG}, ${hoKhau4.MAPHONG}, ${hoKhau5.MAPHONG}\n`);

  // ============================================
  // 5. TẠO NHÂN KHẨU (Chủ hộ + Thành viên)
  // ============================================
  console.log('👥 Tạo nhân khẩu...');
  
  // Hộ 1: A101
  const nk1 = await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau1.MAHOKHAU,
      HOTEN: 'Nguyễn Văn A',
      SOCANCUOC: '001090001234',
      NGAYSINH: new Date('1985-03-15'),
      GIOITINH: 'Nam',
      NOISINH: 'Hà Nội',
      NGUYENQUAN: 'Hà Nội',
      DANTOC: 'Kinh',
      TONGIAO: 'Không',
      QUOCTICH: 'Việt Nam',
      NOITHUONGTRU: 'Hà Nội',
      NGHENGHIEP: 'Kỹ sư',
      QUANHEVOICHUHO: 'Chủ hộ',
      ACTIVATE: true
    }
  });
  
  await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau1.MAHOKHAU,
      HOTEN: 'Trần Thị B',
      SOCANCUOC: '001090001235',
      NGAYSINH: new Date('1987-07-20'),
      GIOITINH: 'Nữ',
      DANTOC: 'Kinh',
      TONGIAO: 'Không',
      QUOCTICH: 'Việt Nam',
      NGHENGHIEP: 'Giáo viên',
      QUANHEVOICHUHO: 'Vợ',
      ACTIVATE: true
    }
  });
  
  await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau1.MAHOKHAU,
      HOTEN: 'Nguyễn Văn C',
      SOCANCUOC: '001090001236',
      NGAYSINH: new Date('2010-05-10'),
      GIOITINH: 'Nam',
      DANTOC: 'Kinh',
      TONGIAO: 'Không',
      QUOCTICH: 'Việt Nam',
      QUANHEVOICHUHO: 'Con',
      ACTIVATE: true
    }
  });
  
  // Hộ 2: A102
  const nk2 = await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau2.MAHOKHAU,
      HOTEN: 'Lê Văn D',
      SOCANCUOC: '001090002234',
      NGAYSINH: new Date('1990-01-01'),
      GIOITINH: 'Nam',
      DANTOC: 'Kinh',
      TONGIAO: 'Phật',
      QUOCTICH: 'Việt Nam',
      NGHENGHIEP: 'Bác sĩ',
      QUANHEVOICHUHO: 'Chủ hộ',
      ACTIVATE: true
    }
  });
  
  await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau2.MAHOKHAU,
      HOTEN: 'Phạm Thị E',
      SOCANCUOC: '001090002235',
      NGAYSINH: new Date('1992-06-15'),
      GIOITINH: 'Nữ',
      DANTOC: 'Kinh',
      QUOCTICH: 'Việt Nam',
      NGHENGHIEP: 'Y tá',
      QUANHEVOICHUHO: 'Vợ',
      ACTIVATE: true
    }
  });
  
  // Hộ 3: B201
  const nk3 = await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau3.MAHOKHAU,
      HOTEN: 'Hoàng Văn F',
      SOCANCUOC: '001090003234',
      NGAYSINH: new Date('1988-11-20'),
      GIOITINH: 'Nam',
      DANTOC: 'Kinh',
      QUOCTICH: 'Việt Nam',
      NGHENGHIEP: 'Kinh doanh',
      QUANHEVOICHUHO: 'Chủ hộ',
      ACTIVATE: true
    }
  });
  
  // Hộ 4: B202
  const nk4 = await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau4.MAHOKHAU,
      HOTEN: 'Vũ Thị G',
      SOCANCUOC: '001090004234',
      NGAYSINH: new Date('1995-08-08'),
      GIOITINH: 'Nữ',
      DANTOC: 'Kinh',
      QUOCTICH: 'Việt Nam',
      NGHENGHIEP: 'Nhân viên văn phòng',
      QUANHEVOICHUHO: 'Chủ hộ',
      ACTIVATE: true
    }
  });
  
  // Hộ 5: C301
  const nk5 = await prisma.nHANKHAU.create({
    data: {
      MAHOKHAU: hoKhau5.MAHOKHAU,
      HOTEN: 'Đỗ Văn H',
      SOCANCUOC: '001090005234',
      NGAYSINH: new Date('2000-12-25'),
      GIOITINH: 'Nam',
      DANTOC: 'Kinh',
      QUOCTICH: 'Việt Nam',
      NGHENGHIEP: 'Sinh viên',
      QUANHEVOICHUHO: 'Chủ hộ',
      ACTIVATE: true
    }
  });
  
  console.log(`✅ Đã tạo 8 nhân khẩu (5 chủ hộ + 3 thành viên)\n`);

  // ============================================
  // 6. CẬP NHẬT IDCHUHO CHO CÁC HỘ
  // ============================================
  console.log('🔗 Cập nhật chủ hộ...');
  
  await prisma.hOKHAU.update({
    where: { MAHOKHAU: hoKhau1.MAHOKHAU },
    data: { IDCHUHO: nk1.MANHANKHAU }
  });
  
  await prisma.hOKHAU.update({
    where: { MAHOKHAU: hoKhau2.MAHOKHAU },
    data: { IDCHUHO: nk2.MANHANKHAU }
  });
  
  await prisma.hOKHAU.update({
    where: { MAHOKHAU: hoKhau3.MAHOKHAU },
    data: { IDCHUHO: nk3.MANHANKHAU }
  });
  
  await prisma.hOKHAU.update({
    where: { MAHOKHAU: hoKhau4.MAHOKHAU },
    data: { IDCHUHO: nk4.MANHANKHAU }
  });
  
  await prisma.hOKHAU.update({
    where: { MAHOKHAU: hoKhau5.MAHOKHAU },
    data: { IDCHUHO: nk5.MANHANKHAU }
  });
  
  console.log('✅ Đã cập nhật chủ hộ cho tất cả hộ khẩu\n');

  // ============================================
  // 7. TẠO LOẠI PHÍ ĐÓNG GÓP
  // ============================================
  console.log('📋 Tạo loại phí đóng góp...');
  
  const loaiPhi1 = await prisma.lOAIPHI.create({
    data: {
      TEN: 'Quỹ từ thiện',
      MOTA: 'Đóng góp vào quỹ từ thiện chung cư'
    }
  });
  
  const loaiPhi2 = await prisma.lOAIPHI.create({
    data: {
      TEN: 'Tết thiếu nhi',
      MOTA: 'Đóng góp tổ chức Tết thiếu nhi'
    }
  });
  
  console.log(`✅ Đã tạo 2 loại phí: ${loaiPhi1.TEN}, ${loaiPhi2.TEN}\n`);

  // ============================================
  // 8. TẠO ĐỢT THU PHÍ
  // ============================================
  console.log('📅 Tạo đợt thu phí...');
  
  const dotThu1 = await prisma.dOTTHUPHI.create({
    data: {
      TEN: 'Phí quản lý tháng 1/2026',
      BATBUOC: true,
      NGAYTAO: new Date(),
      MOTA: 'Thu phí quản lý, điện nước tháng 1/2026',
      NGUOIQUANLYId: admin1.id
    }
  });
  
  const dotThu2 = await prisma.dOTTHUPHI.create({
    data: {
      TEN: 'Quyên góp Tết 2026',
      BATBUOC: false,
      NGAYTAO: new Date(),
      MOTA: 'Quyên góp tổ chức Tết cộng đồng',
      NGUOIQUANLYId: admin2.id
    }
  });
  
  console.log(`✅ Đã tạo 2 đợt thu: ${dotThu1.TEN}, ${dotThu2.TEN}\n`);

  // ============================================
  // 9. TẠO DANH SÁCH THU PHÍ (cho đợt 1)
  // ============================================
  console.log('💵 Tạo danh sách thu phí...');
  
  await prisma.dANHSACHTHUPHI.create({
    data: {
      MADOTTHU: dotThu1.MADOTTHU,
      MAHOKHAU: hoKhau1.MAHOKHAU,
      TIENNHA: 5000000,
      TIENDICHVU: 300000,
      TIENXEMAY: 100000,
      TIENOTO: 400000,
      TIENDIEN: 800000,
      SODIEN: 400,
      TIENNUOC: 200000,
      SONUOC: 20,
      TIENINTERNET: 200000,
      TRANGTHAI: true,
      SOTIENDADONG: 7000000,
      NGAYDONG: new Date('2026-01-05'),
      HINHTHUC: 'Chuyển khoản'
    }
  });
  
  await prisma.dANHSACHTHUPHI.create({
    data: {
      MADOTTHU: dotThu1.MADOTTHU,
      MAHOKHAU: hoKhau2.MAHOKHAU,
      TIENNHA: 5000000,
      TIENDICHVU: 300000,
      TIENXEMAY: 50000,
      TIENOTO: 400000,
      TIENDIEN: 600000,
      SODIEN: 300,
      TIENNUOC: 150000,
      SONUOC: 15,
      TIENINTERNET: 200000,
      TRANGTHAI: false,
      SOTIENDADONG: 0
    }
  });
  
  await prisma.dANHSACHTHUPHI.create({
    data: {
      MADOTTHU: dotThu1.MADOTTHU,
      MAHOKHAU: hoKhau3.MAHOKHAU,
      TIENNHA: 3000000,
      TIENDICHVU: 200000,
      TIENXEMAY: 120000,
      TIENDIEN: 500000,
      SODIEN: 250,
      TIENNUOC: 120000,
      SONUOC: 12,
      TIENINTERNET: 200000,
      TRANGTHAI: true,
      SOTIENDADONG: 4140000,
      NGAYDONG: new Date('2026-01-10'),
      HINHTHUC: 'Tiền mặt'
    }
  });
  
  console.log('✅ Đã tạo danh sách thu cho 3/5 hộ\n');

  // ============================================
  // 10. TẠO ĐÓNG GÓP (cho đợt 2 - tự nguyện)
  // ============================================
  console.log('🎁 Tạo đóng góp tự nguyện...');
  
  await prisma.dONGGOP.create({
    data: {
      MADOTTHU: dotThu2.MADOTTHU,
      MAHOKHAU: hoKhau1.MAHOKHAU,
      MALOAIPHI: loaiPhi1.MALOAIPHI,
      SOTIENDADONG: 500000,
      TRANGTHAI: true,
      NGAYDONG: new Date('2026-01-12'),
      HINHTHUC: 'Chuyển khoản'
    }
  });
  
  await prisma.dONGGOP.create({
    data: {
      MADOTTHU: dotThu2.MADOTTHU,
      MAHOKHAU: hoKhau3.MAHOKHAU,
      MALOAIPHI: loaiPhi2.MALOAIPHI,
      SOTIENDADONG: 200000,
      TRANGTHAI: true,
      NGAYDONG: new Date('2026-01-15'),
      HINHTHUC: 'Tiền mặt'
    }
  });
  
  console.log('✅ Đã tạo 2 khoản đóng góp\n');

  // ============================================
  // 11. TẠO TẠM TRÚ/TẠM VẮNG
  // ============================================
  console.log('🏨 Tạo đăng ký tạm trú/vắng...');
  
  await prisma.tAMTRU.create({
    data: {
      MANHANKHAU: nk5.MANHANKHAU, // Sinh viên thuê trọ
      SODIENTHOAINGUOIDANGKY: '0909123456',
      TUNGAY: new Date('2026-01-01'),
      DENNGAY: new Date('2026-06-30'),
      LYDO: 'Thuê trọ học tập'
    }
  });
  
  await prisma.tAMVANG.create({
    data: {
      MANHANKHAU: nk2.MANHANKHAU, // Bác sĩ đi công tác
      NOITAMTRU: 'TP. Hồ Chí Minh',
      TUNGAY: new Date('2026-02-01'),
      DENNGAY: new Date('2026-02-15'),
      LYDO: 'Công tác ngắn hạn'
    }
  });
  
  console.log('✅ Đã tạo 1 tạm trú và 1 tạm vắng\n');

  // ============================================
  // KẾT QUẢ
  // ============================================
  console.log('\n🎉 SEED DATABASE THÀNH CÔNG!\n');
  console.log('📊 Tổng kết:');
  console.log('  - 2 quản lý (admin, banquanly)');
  console.log('  - 3 loại căn hộ (Cao cấp, Trung bình, Giá rẻ)');
  console.log('  - 5 hộ khẩu');
  console.log('  - 8 nhân khẩu (5 chủ hộ + 3 thành viên)');
  console.log('  - 2 loại phí đóng góp');
  console.log('  - 2 đợt thu phí');
  console.log('  - 3 danh sách thu phí');
  console.log('  - 2 đóng góp tự nguyện');
  console.log('  - 1 tạm trú, 1 tạm vắng');
  console.log('\n🔐 Tài khoản đăng nhập:');
  console.log('  Username: admin');
  console.log('  Password: 123456');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
