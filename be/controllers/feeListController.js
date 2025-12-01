const feeListServices = require("../services/feeListServices");

// GET /danh-sach-thu-phi và GET /danh-sach-thu-phi/:madotthu/:mahokhau
const getFeeListController = async (req, res) => {
  try {
    const { madotthu, mahokhau } = req.params;

    if (madotthu && mahokhau) {
      // Lấy chi tiết 1 bản ghi cụ thể
      const result = await feeListServices.getFeeListEntryById(madotthu, mahokhau);
      return res.status(200).json({ 
        message: "Lấy thông tin thu phí thành công", 
        data: result.entry 
      });
    } else {
      // Lấy danh sách (có phân trang và lọc)
      const filters = { ...req.query };
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;

      delete filters.page;
      delete filters.limit;

      const result = await feeListServices.getFeeList(filters, page, limit);

      if (!result || result.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      }

      return res.status(200).json({
        message: "Lấy danh sách thu phí thành công",
        data: result.feeList,
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
      message: "Lỗi lấy thông tin danh sách thu phí", 
      error: error.message 
    });
  }
};

// POST /danh-sach-thu-phi
const createFeeListController = async (req, res) => {
  try {
    const data = { ...req.body };
    // Validate cơ bản
    if (!data.MADOTTHU || !data.MAHOKHAU) {
        return res.status(400).json({ message: "Mã đợt thu và Mã hộ khẩu là bắt buộc" });
    }

    const result = await feeListServices.createFeeListEntry(data);
    return res.status(201).json({ 
        message: "Thêm vào danh sách thu phí thành công", 
        data: result.newEntry 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi thêm danh sách thu phí", 
        error: error.message 
    });
  }
};

// PUT /danh-sach-thu-phi/:madotthu/:mahokhau
const updateFeeListController = async (req, res) => {
  try {
    const { madotthu, mahokhau } = req.params;
    const data = { ...req.body };
    
    const result = await feeListServices.updateFeeListEntry(madotthu, mahokhau, data);
    return res.status(200).json({ 
        message: "Cập nhật thông tin thu phí thành công", 
        data: result.updatedEntry 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi cập nhật thông tin thu phí", 
        error: error.message 
    });
  }
};

// DELETE /danh-sach-thu-phi/:madotthu/:mahokhau
const deleteFeeListController = async (req, res) => {
  try {
    const { madotthu, mahokhau } = req.params;
    const result = await feeListServices.deleteFeeListEntry(madotthu, mahokhau);
    return res.status(200).json({ 
        message: "Xóa khỏi danh sách thu phí thành công", 
        data: result.deletedEntry 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi xóa khỏi danh sách thu phí", 
        error: error.message 
    });
  }
};

module.exports = {
  getFeeListController,
  createFeeListController,
  updateFeeListController,
  deleteFeeListController
};