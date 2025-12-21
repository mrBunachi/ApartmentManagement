const feeTypeServices = require("../services/loaiPhiDongGopServices");

// GET /loai-phi và GET /loai-phi/:id
const getFeeTypeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      // Lấy chi tiết
      const result = await feeTypeServices.getFeeTypeById(id);
      return res.status(200).json({ 
        message: "Lấy thông tin loại phí thành công", 
        data: result.feeType 
      });
    } else {
      // Lấy danh sách (Phân trang & Lọc)
      const query = { ...req.query };
      
      // Tách page và limit ra để xử lý phân trang
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;

      // Xóa page và limit khỏi object lọc để tránh lỗi query database
      delete query.page;
      delete query.limit;

      const result = await feeTypeServices.getFeeTypes(query, page, limit);

      if (!result || result.count === 0) {
        // Có thể trả về 200 với mảng rỗng thay vì 404 để frontend dễ xử lý
        return res.status(200).json({ 
            message: "Danh sách trống", 
            data: [], 
            total: 0 
        });
      }

      return res.status(200).json({
        message: "Lấy danh sách loại phí thành công",
        data: result.feeTypes,
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
      message: "Lỗi lấy thông tin loại phí", 
      error: error.message 
    });
  }
};

// ... (Giữ nguyên các hàm create, update, delete như cũ vì logic cơ bản đã ổn)
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