const phiThuHoServices = require('../services/phiThuHoServices');

const getAllPhiThuHo = async (req, res) => {
    try {
        const { madotthu } = req.query;
        const result = await phiThuHoServices.getAllPhiThuHo(madotthu);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy dữ liệu", error: error.message });
    }
};

const updatePhiThuHo = async (req, res) => {
    try {
        const { madotthu, mahokhau } = req.params;
        const data = req.body;

        // Dữ liệu gửi lên có thể gồm: TONGDIEN, DONGIADIEN, TONGNUOC, DONGIANUOC, TIENINTERNET
        const result = await phiThuHoServices.updatePhiThuHo(madotthu, mahokhau, data);
        
        res.status(200).json({ 
            message: "Cập nhật phí thu hộ thành công", 
            data: result 
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

module.exports = {
    getAllPhiThuHo,
    updatePhiThuHo
};