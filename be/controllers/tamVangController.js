const tamVangServices = require("../services/tamVangServices");

/**
 * Controller tạo mới đăng ký tạm vắng
 */
const createTamVangController = async (req, res) => {
    try {
        const data = { ...req.body };
        const { newTamVang } = await tamVangServices.createTamVang(data);
        
        return res.status(201).json({
            message: "Đăng ký tạm vắng thành công",
            tamVang: newTamVang
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi khi tạo đăng ký tạm vắng",
            error: error.message
        });
    }
};

/**
 * Controller cập nhật thông tin tạm vắng
 */
const updateTamVangController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        
        const { updatedTamVang } = await tamVangServices.updateTamVang(id, data);
        
        return res.status(200).json({
            message: "Cập nhật thông tin tạm vắng thành công",
            tamVang: updatedTamVang
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi cập nhật tạm vắng",
            error: error.message
        });
    }
};

/**
 * Controller xóa đăng ký tạm vắng
 */
const deleteTamVangController = async (req, res) => {
    try {
        const { id } = req.params;
        const { deletedTamVang } = await tamVangServices.deleteTamVang(id);
        
        return res.status(200).json({
            message: "Xóa thông tin tạm vắng thành công",
            tamVang: deletedTamVang
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi xóa tạm vắng",
            error: error.message
        });
    }
};

/**
 * Controller lấy thông tin tạm vắng (Lấy 1 hoặc lấy danh sách)
 */
const getTamVangController = async (req, res) => {
    try {
        const { id } = req.params;
        let result;

        if (id) {
            // Trường hợp lấy chi tiết 1 bản ghi theo ID
            const { tamVang } = await tamVangServices.getTamVangById(id, true);
            result = tamVang;
        } else {
            // Trường hợp lấy danh sách có phân trang và filter
            const filters = { ...req.query };
            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 20;
            const include = filters.include === 'true';

            delete filters.page;
            delete filters.limit;
            delete filters.include;

            result = await tamVangServices.getTamVangs(filters, page, limit, include);
        }

        if (!result || (Array.isArray(result.tamVangs) && result.tamVangs.length === 0)) {
            return res.status(404).json({ message: "Không tìm thấy thông tin tạm vắng" });
        }

        return res.status(200).json({
            message: "Lấy thông tin tạm vắng thành công",
            data: result
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi lấy thông tin tạm vắng",
            error: error.message
        });
    }
};

module.exports = {
    createTamVangController,
    updateTamVangController,
    deleteTamVangController,
    getTamVangController
};