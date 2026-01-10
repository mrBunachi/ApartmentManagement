const residentServices = require("../services/residentServices");

/**
 * Tạo nhân khẩu mới
 */
const createResidentController = async (req, res) => {
  try {
    const data = { ...req.body };
    const newResident = await residentServices.createResident(data);

    if (!newResident || !newResident.newRes) {
      return res.status(500).json({ message: "Không tạo được nhân khẩu" });
    }

    res
      .status(201)
      .json({
        message: "Tạo nhân khẩu thành công",
        resident: newResident.newRes,
      });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Lỗi tạo nhân khẩu", error: error.message });
  }
};

/**
 * Lấy thông tin nhân khẩu (một hoặc nhiều)
 * - Nếu có `id` trong `req.params`: Lấy 1 nhân khẩu.
 * - Nếu không có `id`: Lấy danh sách nhân khẩu theo `req.query` (filters, page, limit).
 */
const getResidentController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ params
    const include = req.query.include !== undefined
    let residents; // Biến này sẽ chứa kết quả (theo đúng style của userController)

    if (id) {
      // Lấy 1 nhân khẩu theo id
      const result = (await residentServices.getResById(id,null,include)).resident;

      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy cư dân" });
      }
      residents = [result]; // Trả về mảng 1 phần tử cho nhất quán
    } else {
      // Lấy danh sách cư dân theo filter
      const filters = { ...req.query };
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;

      // Xóa page/limit khỏi filter để truyền data sạch vào service
      delete filters.page;
      delete filters.limit;
      delete filters.include;

      const result = await residentServices.getResidents(filters, page, limit,include);

      if (!result || !result.residents || result.count=== 0) {
        return res.status(404).json({ message: "Không tìm thấy cư dân nào" });
      }
      residents = result; // Trả về object { residents: [], count: ... }
    }

    return res
      .status(200)
      .json({ message: "Tìm cư dân thành công", residents });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: "Lỗi tìm thông tin cư dân", error: error.message });
  }
};

/**
 * Cập nhật thông tin cư dân
 */
const updateResidentController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID nhân khẩu từ URL
    const data = { ...req.body }; // Lấy dữ liệu cập nhật từ body
    console.log(id)
    console.log(data)
    const updatedResident = await residentServices.updateResident(id, data);

    if (!updatedResident || !updatedResident.updateRes) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cư dân để cập nhật" });
    }

    res
      .status(200)
      .json({
        message: "Cập nhật cư dân thành công",
        resident: updatedResident.updateRes,
      });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Lỗi cập nhật nhân khẩu", error: error.message });
  }
};

/**
 * Xóa (Deactivate) nhân khẩu
 */
const deleteResidentController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID nhân khẩu từ URL

    // (Không cần kiểm tra user tự xóa mình như trong userController)

    const deletedResident = await residentServices.deleteResident(id);

    if (!deletedResident || !deletedResident.deleteRes) {
      return res.status(404).json({ message: "Cư dân không tồn tại" });
    }

    return res
      .status(200)
      .json({
        message: "Xóa cư dân thành công",
        resident: deletedResident.deleteRes,
      });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Không thể xóa cư dân đang là chủ hộ ", error: error.message });
  }
};

module.exports = {
  createResidentController,
  getResidentController,
  updateResidentController,
  deleteResidentController,
};