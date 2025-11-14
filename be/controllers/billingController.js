const billingService = require("../services/billingService");

const generateMonthlyBill = async (req, res) => {
    try {
        const adminId = req.user.id; 
        const dotThuPhiData = req.body; 

        const result = await billingService.generateBill(dotThuPhiData, adminId);
        
        res.status(201).json({ 
            message: "Tạo đợt thu phí và các hóa đơn nháp thành công", 
            dotThuPhi: result 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo bill", error: error.message });
    }
}


const updateConsumptionData = async (req, res) => {
    try {
        const { MADOTTHU, updates } = req.body;
        
        await billingService.updateConsumption(MADOTTHU, updates);

        res.status(200).json({ message: "Cập nhật số liệu điện nước thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật số liệu", error: error.message });
    }
}

module.exports = {
    generateMonthlyBill,
    updateConsumptionData
};