const loaiPhiServices = require('../services/loaiPhiDongGopServices');

const getAllLoaiPhi = async (req, res) => {
    try {
        const result = await loaiPhiServices.getLoaiPhis();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách loại phí", error: error.message });
    }
};

const createLoaiPhi = async (req, res) => {
    try {
        const data = req.body;
        const newLoaiPhi = await loaiPhiServices.createLoaiPhi(data);
        res.status(201).json({ message: "Tạo loại phí thành công", data: newLoaiPhi });
    } catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi tạo loại phí", error: error.message });
    }
};

const updateLoaiPhi = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updated = await loaiPhiServices.updateLoaiPhi(id, data);
        res.status(200).json({ message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

const deleteLoaiPhi = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await loaiPhiServices.deleteLoaiPhi(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi xóa", error: error.message });
    }
};

module.exports = {
    getAllLoaiPhi,
    createLoaiPhi,
    updateLoaiPhi,
    deleteLoaiPhi,
};