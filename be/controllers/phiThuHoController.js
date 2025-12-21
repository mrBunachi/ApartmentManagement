const service = require("../services/phiThuHoServices");

const createController = async (req, res) => {
  try {
    console.log(req.body);
    const result = await service.createPhiThuHo(req.body);
    return res.status(201).json({ message: "Kê khai phí thành công", data: result.newPhi });
  } catch (error) {
    return res.status(error.status || 500).json({ message: "Lỗi tạo phí", error: error.message });
  }
};

const getController = async (req, res) => {
  try {
    const filters = { ...req.query };
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    delete filters.page;
    delete filters.limit;

    const result = await service.getPhiThuHoList(filters, page, limit);

    return res.status(200).json({
      message: "Lấy danh sách thành công",
      data: result.list,
      pagination: {
        total: result.count,
        page, limit,
        totalPages: Math.ceil(result.count / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Update: Cần 2 params (MADOTTHU và MAHOKHAU)
// Route sẽ dạng: PUT /api/phi-thu-ho/:maDotThu/:maHoKhau
const updateController = async (req, res) => {
  try {
    const { maDotThu, maHoKhau } = req.params;
    const result = await service.updatePhiThuHo(maDotThu, maHoKhau, req.body);
    return res.status(200).json({ message: "Cập nhật thành công", data: result.updated });
  } catch (error) {
    return res.status(error.status || 500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

// Delete: Tương tự Update
const deleteController = async (req, res) => {
  try {
    const { maDotThu, maHoKhau } = req.params;
    const result = await service.deletePhiThuHo(maDotThu, maHoKhau);
    return res.status(200).json({ message: "Xóa thành công", data: result.deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ message: "Lỗi xóa", error: error.message });
  }
};

module.exports = { 
  createController, 
  getController, 
  updateController, 
  deleteController 
};