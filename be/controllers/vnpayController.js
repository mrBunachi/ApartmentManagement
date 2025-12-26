vnpay_Service = require("../services/vnPayServices")

const createUrlController = async (req, res) => {
    try {
        const { amount, des, id_order } = req.body;

        // Kiểm tra sơ bộ nếu thiếu dữ liệu quan trọng
        if (!amount || !id_order) {
            return res.status(400).json({ message: "Thiếu thông tin số tiền hoặc mã đơn hàng" });
        }

        // Lấy IP người dùng để truyền vào vnpay
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Gọi hàm service đã import bằng dấu { } ở trên
        const paymentUrl = await vnpay_Service.create_url(amount, des, id_order, ipAddr);
        
        return res.status(201).json({
            message: "Tạo url thành công",
            tamVang: paymentUrl
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi khi tạo url thanh toán",
            error: error.message
        });
    }
};

const hanldeCallback = async (req, res) => {
    try{
        const  callback_mess=  req.query
         

    }
    catch (error) {
        return res.status(error.status || 500).json({
            message: "Lỗi khi tạo url thanh toán",
            error: error.message
        });
    }
}