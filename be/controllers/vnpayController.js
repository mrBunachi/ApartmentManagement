vnpay_S = require("../services/vnPayServices")

const createUrlController = async (req, res) => {
    try {
        const { amount, des, id_order, identifier } = req.body;
        // id_order theo dang "madotthu-mahokhau-loaiphi" (0 là bắt buộc 1 là tự nguyện)
        // identifier: số căn cước của cư dân để redirect về đúng trang

        // Kiểm tra sơ bộ nếu thiếu dữ liệu quan trọng
        if (!amount || !id_order) {
            return res.status(400).json({ message: "Thiếu thông tin số tiền hoặc mã đơn hàng" });
        }

        // Lấy IP người dùng để truyền vào vnpay
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Gọi hàm service với identifier
        const paymentUrl = await vnpay_S.create_url(amount, des, id_order, ipAddr, identifier);
        
        return res.status(201).json({
            message: "Tạo url thành công",
            link: paymentUrl
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi khi tạo url thanh toán",
            error: error.message
        });
    }
};

const handleCallback = async (req, res) => {
    try {
        const callback_mess = req.query; // VNPAY trả về params qua URL (GET) nên dùng query
        
        // Gọi hàm service và chờ kết quả
        const result = await vnpay_S.handle_Callback(callback_mess); 
        
        // Lấy identifier (số căn cước) từ query params nếu có
        const identifier = req.query.identifier || '';
        
        // Redirect về frontend với kết quả
        // Ưu tiên FRONT_URI từ env, fallback về localhost cho development
        const frontendUrl = process.env.FRONT_URI || process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = `${frontendUrl}/resident/dashboard?id=${identifier}&payment=${result.status}&code=${result.code}&message=${encodeURIComponent(result.message)}`;
        
        console.log(`VNPay redirect to: ${redirectUrl}`); // Log để debug
        return res.redirect(redirectUrl);

    } catch (error) {
        const frontendUrl = process.env.FRONT_URI || process.env.FRONTEND_URL || 'http://localhost:5173';
        console.error('VNPay callback error:', error);
        return res.redirect(`${frontendUrl}/resident/dashboard?payment=error&message=${encodeURIComponent('Lỗi xử lý thanh toán')}`);
    }
}

module.exports ={
    createUrlController,
    handleCallback
}