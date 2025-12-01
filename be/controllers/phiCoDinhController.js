const fixedFeeServices = require("../services/phiCoDinhServices");

// GET /phi-co-dinh và GET /phi-co-dinh/:id
const getFixedFeeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const result = await fixedFeeServices.getFixedFeeById(id);
      return res.status(200).json({ 
        message: "Lấy thông tin phí cố định thành công", 
        data: result.fixedFee 
      });
    } else {
      const filters = { ...req.query };
      // Bảng này thường ít dữ liệu nên có thể không cần phân trang phức tạp, 
      // nhưng giữ lại filter để tìm kiếm
      const result = await fixedFeeServices.getFixedFees(filters);

      if (!result || result.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      }

      return res.status(200).json({
        message: "Lấy danh sách phí cố định thành công",
        data: result.fixedFees,
        total: result.count
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({ 
      message: "Lỗi lấy thông tin phí cố định", 
      error: error.message 
    });
  }
};

// POST /phi-co-dinh
const createFixedFeeController = async (req, res) => {
  try {
    const data = { ...req.body };
    // Validate cơ bản: LOAICANHO là bắt buộc
    if (!data.LOAICANHO) {
        return res.status(400).json({ message: "Mã loại căn hộ (LOAICANHO) là bắt buộc" });
    }

    const result = await fixedFeeServices.createFixedFee(data);
    return res.status(201).json({ 
        message: "Tạo phí cố định thành công", 
        data: result.newFixedFee 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi tạo phí cố định", 
        error: error.message 
    });
  }
};

// PUT /phi-co-dinh/:id
const updateFixedFeeController = async (req, res) => {
  try {
    const { id } = req.params; // id ở đây là LOAICANHO cũ
    const data = { ...req.body };
    
    // Không cho phép sửa LOAICANHO (PK) trực tiếp qua update prisma thông thường 
    // (trừ khi logic nghiệp vụ yêu cầu xóa đi tạo lại hoặc dùng query raw, ở đây ta chặn sửa PK)
    if (data.LOAICANHO && data.LOAICANHO !== id) {
        return res.status(400).json({ message: "Không được phép thay đổi mã Loại căn hộ" });
    }

    const result = await fixedFeeServices.updateFixedFee(id, data);
    return res.status(200).json({ 
        message: "Cập nhật phí cố định thành công", 
        data: result.updatedFixedFee 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi cập nhật phí cố định", 
        error: error.message 
    });
  }
};

// DELETE /phi-co-dinh/:id
const deleteFixedFeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fixedFeeServices.deleteFixedFee(id);
    return res.status(200).json({ 
        message: "Xóa phí cố định thành công", 
        data: result.deletedFixedFee 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi xóa phí cố định", 
        error: error.message 
    });
  }
};

module.exports = {
  getFixedFeeController,
  createFixedFeeController,
  updateFixedFeeController,
  deleteFixedFeeController
};