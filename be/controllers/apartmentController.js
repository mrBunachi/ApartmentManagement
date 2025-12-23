const apartmentServices = require("../services/apartmentServices");

/**
 * Tạo hộ khẩu mới
 */
const createApartmentController = async (req, res) => {
  try {
    const data = { ...req.body };
    const newApartment = await apartmentServices.createApartment(data);
    
    if (!newApartment || !newApartment.newApartment) {
      return res.status(500).json({ message: "Không tạo được hộ khẩu" });
    }

    res
      .status(201)
      .json({
        message: "Tạo hộ khẩu thành công",
        apartment: newApartment.newApartment,
      });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Lỗi tạo hộ khẩu", error: error.message });
  }
};

/**
 * Lấy thông tin hộ khẩu (một hoặc nhiều)
 * - Nếu có `id` trong `req.params`: Lấy 1 hộ khẩu.
 * - Nếu không có `id`: Lấy danh sách hộ khẩu theo `req.query` (filters, page, limit).
 */
const getApartmentController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ params
    
    // Kiểm tra xem user có muốn include thông tin liên quan (Chủ hộ, Phí) không
    // Ví dụ: ?include=true
    const include = req.query.include !== undefined; 
    
    let apartments; // Biến chứa kết quả trả về

    if (id) {
      // Lấy 1 hộ khẩu theo id
      const result = (await apartmentServices.getApartmentById(id, include)).apartment;

      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy hộ khẩu" });
      }
      apartments = [result]; // Trả về mảng 1 phần tử cho nhất quán
    } else {
      // Lấy danh sách hộ khẩu theo filter
      const filters = { ...req.query };
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20; // Default limit giống residentController

      // Xóa các field điều khiển luồng để lấy data filter sạch
      delete filters.page;
      delete filters.limit;
      delete filters.include;

      const result = await apartmentServices.getApartments(filters, page, limit, include);

      if (!result || !result.apartments || result.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy hộ khẩu nào" });
      }
      apartments = result; // Trả về object { apartments: [], count: ... }
    }

    return res
      .status(200)
      .json({ message: "Tìm hộ khẩu thành công", apartments });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: "Lỗi tìm thông tin hộ khẩu", error: error.message });
  }
};

/**
 * Cập nhật thông tin hộ khẩu
 */
const updateApartmentController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID hộ khẩu từ URL
    const data = { ...req.body }; // Lấy dữ liệu cập nhật từ body

    const updatedApartment = await apartmentServices.updateApartment(id, data);

    // Lưu ý: service trả về object { updateApt: ... }
    if (!updatedApartment || !updatedApartment.updateApt) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hộ khẩu để cập nhật" });
    }

    res
      .status(200)
      .json({
        message: "Cập nhật hộ khẩu thành công",
        apartment: updatedApartment.updateApt,
      });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Lỗi cập nhật hộ khẩu", error: error.message });
  }
};

/**
 * Xóa (Deactivate) hộ khẩu
 */
const deleteApartmentController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID hộ khẩu từ URL

    const deletedApartment = await apartmentServices.deleteApartment(id);

    // Lưu ý: service trả về object { deleteApt: ... }
    if (!deletedApartment || !deletedApartment.deleteApt) {
      return res.status(404).json({ message: "Hộ khẩu không tồn tại" });
    }

    return res
      .status(200)
      .json({
        message: "Xóa (deactivate) hộ khẩu thành công",
        apartment: deletedApartment.deleteApt,
      });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Lỗi xóa hộ khẩu", error: error.message });
  }
};

module.exports = {
  createApartmentController,
  getApartmentController,
  updateApartmentController,
  deleteApartmentController,
};