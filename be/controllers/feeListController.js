// be/controllers/feeListController.js
const feeListServices = require('../services/feeListServices');

const getFeeListByDotThu = async (req, res) => {
    try {
        const maDotThu = req.params.madotthu;
        if (!maDotThu) return res.status(400).json({ message: "Thiếu mã đợt thu" });

        const result = await feeListServices.getFeeListByDotThu(maDotThu);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách thu phí", error: error.message });
    }
};

const getFeeDetail = async (req, res) => {
    try {
        const { madotthu, mahokhau } = req.params;
        const result = await feeListServices.getFeeDetail(madotthu, mahokhau);
        res.status(200).json({ data: result });
    } catch (error) {
         res.status(error.status || 500).json({ message: "Lỗi lấy chi tiết", error: error.message });
    }
}

const updatePayment = async (req, res) => {
    try {
        const { madotthu, mahokhau } = req.params;
        const { SOTIENDADONG, HINHTHUC } = req.body;

        if (SOTIENDADONG === undefined) {
             return res.status(400).json({ message: "Cần nhập số tiền đã đóng" });
        }

        const result = await feeListServices.updatePaymentStatus(madotthu, mahokhau, SOTIENDADONG, HINHTHUC);
        res.status(200).json({ message: "Cập nhật thanh toán thành công", data: result });
    } catch (error) {
        res.status(error.status || 500).json({ message: "Lỗi cập nhật thanh toán", error: error.message });
    }
};

const getUnpaidFeeListByHousehold = async (req, res) => {
    try {
        const { mahokhau } = req.params;
        if (!mahokhau) {
            return res.status(400).json({ message: "Thiếu mã hộ khẩu" });
        }

        const result = await feeListServices.getUnpaidFeeListByHousehold(mahokhau);
        res.status(200).json({ 
            message: "Lấy danh sách khoản chưa đóng thành công",
            data: result 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

module.exports = {
    getFeeListByDotThu,
    getFeeDetail,
    updatePayment,
    getUnpaidFeeListByHousehold,
};