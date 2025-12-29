vnpay_S = require("../services/vnPayServices")

const createUrlController = async (req, res) => {
    try {
        const { amount, des, id_order } = req.body;
        // id_order theo dangj "madotthu-mahokhau-loaiphi" (0 là bắt buộc 1 là k bắt buộc)

        // Kiểm tra sơ bộ nếu thiếu dữ liệu quan trọng
        if (!amount || !id_order) {
            return res.status(400).json({ message: "Thiếu thông tin số tiền hoặc mã đơn hàng" });
        }

        // Lấy IP người dùng để truyền vào vnpay
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Gọi hàm service đã import bằng dấu { } ở trên
        const paymentUrl = await vnpay_S.create_url(amount, des, id_order, ipAddr);
        
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

const handleCallback = async (req, res) => { // Sửa tên hàm cho chuẩn
    try {
        const callback_mess = req.query; // VNPAY trả về params qua URL (GET) nên dùng query
        
        // Gọi hàm service và chờ kết quả
        const result = await vnpay_S.handle_Callback(callback_mess); 
        
        if (result.status == "success"){

        }
        else if(result.status == "fail"){

        }
        else if(result.status == 'error'){

        }
        return res.status(200).json(result); 

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xử lý callback",
            error: error.message
        });
    }
}

module.exports ={
    createUrlController,
    handleCallback
}