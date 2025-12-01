const feeTypeServices = require("../services/loaiPhiDongGopServices");

// GET /loai-phi và GET /loai-phi/:id
const getFeeTypeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const result = await feeTypeServices.getFeeTypeById(id);
      return res.status(200).json({ 
        message: "Lấy thông tin loại phí thành công", 
        data: result.feeType 
      });
    } else {
      const filters = { ...req.query };
      const result = await feeTypeServices.getFeeTypes(filters);

      if (!result || result.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      }

      return res.status(200).json({
        message: "Lấy danh sách loại phí thành công",
        data: result.feeTypes,
        total: result.count
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({ 
      message: "Lỗi lấy thông tin loại phí", 
      error: error.message 
    });
  }
};

// POST /loai-phi
const createFeeTypeController = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.TEN) {
        return res.status(400).json({ message: "Tên loại phí là bắt buộc" });
    }
    const result = await feeTypeServices.createFeeType(data);
    return res.status(201).json({ 
        message: "Tạo loại phí thành công", 
        data: result.newFeeType 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi tạo loại phí", 
        error: error.message 
    });
  }
};

// PUT /loai-phi/:id
const updateFeeTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const result = await feeTypeServices.updateFeeType(id, data);
    return res.status(200).json({ 
        message: "Cập nhật loại phí thành công", 
        data: result.updatedFeeType 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi cập nhật loại phí", 
        error: error.message 
    });
  }
};

// DELETE /loai-phi/:id
const deleteFeeTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await feeTypeServices.deleteFeeType(id);
    return res.status(200).json({ 
        message: "Xóa loại phí thành công", 
        data: result.deletedFeeType 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi xóa loại phí", 
        error: error.message 
    });
  }
};

module.exports = {
  getFeeTypeController,
  createFeeTypeController,
  updateFeeTypeController,
  deleteFeeTypeController
};