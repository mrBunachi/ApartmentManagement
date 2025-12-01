const collectedFeeServices = require("../services/phiThuHoServices");

// GET /phi-thu-ho và GET /phi-thu-ho/:madotthu/:mahokhau
const getCollectedFeeController = async (req, res) => {
  try {
    const { madotthu, mahokhau } = req.params;

    if (madotthu && mahokhau) {
      const result = await collectedFeeServices.getCollectedFeeById(madotthu, mahokhau);
      return res.status(200).json({ 
        message: "Lấy thông tin phí thu hộ thành công", 
        data: result.entry 
      });
    } else {
      const filters = { ...req.query };
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;

      delete filters.page;
      delete filters.limit;

      const result = await collectedFeeServices.getCollectedFees(filters, page, limit);

      if (!result || result.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      }

      return res.status(200).json({
        message: "Lấy danh sách phí thu hộ thành công",
        data: result.collectedFees,
        pagination: {
            total: result.count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(result.count / limit)
        }
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({ 
      message: "Lỗi lấy thông tin phí thu hộ", 
      error: error.message 
    });
  }
};

// POST /phi-thu-ho
const createCollectedFeeController = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.MADOTTHU || !data.MAHOKHAU) {
        return res.status(400).json({ message: "Mã đợt thu và Mã hộ khẩu là bắt buộc" });
    }

    const result = await collectedFeeServices.createCollectedFee(data);
    return res.status(201).json({ 
        message: "Tạo phí thu hộ thành công", 
        data: result.newEntry 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi tạo phí thu hộ", 
        error: error.message 
    });
  }
};

// PUT /phi-thu-ho/:madotthu/:mahokhau
const updateCollectedFeeController = async (req, res) => {
  try {
    const { madotthu, mahokhau } = req.params;
    const data = { ...req.body };
    
    const result = await collectedFeeServices.updateCollectedFee(madotthu, mahokhau, data);
    return res.status(200).json({ 
        message: "Cập nhật phí thu hộ thành công", 
        data: result.updatedEntry 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi cập nhật phí thu hộ", 
        error: error.message 
    });
  }
};

// DELETE /phi-thu-ho/:madotthu/:mahokhau
const deleteCollectedFeeController = async (req, res) => {
  try {
    const { madotthu, mahokhau } = req.params;
    const result = await collectedFeeServices.deleteCollectedFee(madotthu, mahokhau);
    return res.status(200).json({ 
        message: "Xóa phí thu hộ thành công", 
        data: result.deletedEntry 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi xóa phí thu hộ", 
        error: error.message 
    });
  }
};

module.exports = {
  getCollectedFeeController,
  createCollectedFeeController,
  updateCollectedFeeController,
  deleteCollectedFeeController
};