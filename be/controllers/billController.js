const billServices = require('../services/billServices');

const createBulkBill = async (req, res) => {
    try {
        const maDotThu = req.params.madotthu;
        const listData = req.body; // Mong đợi là một Array

        if (!Array.isArray(listData) || listData.length === 0) {
            return res.status(400).json({ message: "Dữ liệu gửi lên phải là một danh sách (Array) và không được rỗng" });
        }

        const result = await billServices.createBill(maDotThu, listData);
        
        res.status(200).json({ 
            message: "Hoàn tất xử lý danh sách", 
            summary: {
                total: listData.length,
                success: result.success.length,
                failed: result.errors.length
            },
            details: result 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

const createBulkContributionBill = async (req, res) => {
    try {
        const maDotThu = req.params.madotthu;
        const listData = req.body;

        if (!Array.isArray(listData) || listData.length === 0) {
            return res.status(400).json({ message: "Dữ liệu gửi lên phải là một danh sách (Array)" });
        }

        const result = await billServices.createContributionBill(maDotThu, listData);

        res.status(200).json({ 
            message: "Hoàn tất xử lý danh sách đóng góp", 
            summary: {
                total: listData.length,
                success: result.success.length,
                failed: result.errors.length
            },
            details: result 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

module.exports = {
    createBulkBill,
    createBulkContributionBill,
};