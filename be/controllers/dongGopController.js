const dongGopServices = require('../services/dongGopServices');

const getAllDongGop = async (req, res) => {
    try {
        const filters = { ...req.query };
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        
        const result = await dongGopServices.getDongGops(filters, page, limit);
        res.status(200).json({ 
            data: result.dongGops, 
            meta: {
                total: result.count,
                page,
                limit
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách đóng góp", error: error.message });
    }
};

const createDongGop = async (req, res) => {
    try {
        const data = req.body;
        const newDongGop = await dongGopServices.createDongGop(data);
        res.status(201).json({ message: "Tạo phiếu đóng góp thành công", data: newDongGop });
    }
    catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi tạo đóng góp", error: error.message });
    }
};

const updateDongGop = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updated = await dongGopServices.updateDongGop(id, data);
        res.status(200).json({ message: "Cập nhật thành công", data: updated });
    }
    catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

const deleteDongGop = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await dongGopServices.deleteDongGop(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi xóa", error: error.message });
    }
};

module.exports = {
    getAllDongGop,
    createDongGop,
    updateDongGop,
    deleteDongGop,
}