const dotThuPhiServices = require('../services/dotThuPhiServices');

const getAllDotThuPhi = async (req, res) => {
    try {
        const filters = { ...req.query };
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 20;
        
        // Xóa page và limit khỏi filters trước khi truyền vào service
        delete filters.page;
        delete filters.limit;
        
        const dotThuPhiList = await dotThuPhiServices.getDotThuPhis(filters, page, limit);
        res.status(200).json({ dotThuPhi: dotThuPhiList });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách đợt thu phí", error: error.message });
    }
};

const getDotThuPhiById = async (req, res) => {  
    try {
        const id = req.params.id;
        const dotThuPhi = await dotThuPhiServices.getDotThuPhiById(id);
        if (!dotThuPhi) {
            return res.status(404).json({ message: "Đợt thu phí không tồn tại" });
        }
        res.status(200).json({ dotThuPhi: dotThuPhi });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi lấy đợt thu phí", error: error.message });
    }
};


const createDotThuPhi = async (req, res) => {
    try {
        const dotThuPhiData = req.body;
        const newDotThuPhi = await dotThuPhiServices.createDotThuPhi(dotThuPhiData);
        res.status(201).json({dotThuPhi: newDotThuPhi });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi tạo đợt thu phí", error: error.message });
    }
};


const updateDotThuPhi = async (req, res) => {
    try {
        const id = req.params.id;
        const dotThuPhiData = req.body;
        const updatedDotThuPhi = await dotThuPhiServices.updateDotThuPhi(id, dotThuPhiData);
        res.status(200).json({ dotThuPhi: updatedDotThuPhi });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật đợt thu phí", error: error.message });
    }
};


const deleteDotThuPhi = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await dotThuPhiServices.deleteDotThuPhi(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi xóa đợt thu phí", error: error.message });
    }
};

module.exports = {
    getAllDotThuPhi,
    getDotThuPhiById,
    createDotThuPhi,
    updateDotThuPhi,
    deleteDotThuPhi,
}