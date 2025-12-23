const tamTruServices = require("../services/tamTruServices");

/**
 * Controller tạo mới đăng ký tạm trú
 */
const createTamTruController = async (req, res) => {
    try {
        const data = { ...req.body };
        const { newTamTru } = await tamTruServices.createTamTru(data);
        
        return res.status(201).json({
            message: "Đăng ký tạm trú thành công",
            tamTru: newTamTru
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi khi tạo đăng ký tạm trú",
            error: error.message
        });
    }
};

/**
 * Controller cập nhật thông tin tạm trú
 */
const updateTamTruController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        
        const { updatedTamTru } = await tamTruServices.updateTamTru(id, data);
        
        return res.status(200).json({
            message: "Cập nhật thông tin tạm trú thành công",
            tamTru: updatedTamTru
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi cập nhật tạm trú",
            error: error.message
        });
    }
};

/**
 * Controller xóa đăng ký tạm trú
 */
const deleteTamTruController = async (req, res) => {
    try {
        const { id } = req.params;
        const { deletedTamTru } = await tamTruServices.deleteTamTru(id);
        
        return res.status(200).json({
            message: "Xóa thông tin tạm trú thành công",
            tamTru: deletedTamTru
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi xóa tạm trú",
            error: error.message
        });
    }
};

/**
 * Controller lấy thông tin tạm trú (Lấy 1 hoặc lấy danh sách)
 */
const getTamTruController = async (req, res) => {
    try {
        const { id } = req.params;
        let result;

        if (id) {
            // Trường hợp lấy chi tiết 1 bản ghi theo ID
            const { tamTru } = await tamTruServices.getTamTruById(id, true);
            result = tamTru;
        } else {
            // Trường hợp lấy danh sách có phân trang và filter
            const filters = { ...req.query };
            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 20;
            const include = filters.include === 'true'; // Kiểm tra query string ?include=true

            delete filters.page;
            delete filters.limit;
            delete filters.include;

            result = await tamTruServices.getTamTrus(filters, page, limit, include);
        }

        if (!result || (Array.isArray(result.tamTrus) && result.tamTrus.length === 0)) {
            return res.status(404).json({ message: "Không tìm thấy thông tin tạm trú" });
        }

        return res.status(200).json({
            message: "Lấy thông tin tạm trú thành công",
            data: result
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi lấy thông tin tạm trú",
            error: error.message
        });
    }
};

module.exports = {
    createTamTruController,
    updateTamTruController,
    deleteTamTruController,
    getTamTruController
};