const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const { prisma } = require("../config/database");
require('dotenv').config();

// Khởi tạo instance
const vnpay = new VNPay({
    tmnCode: process.env.TMNCODE,
    secureSecret: process.env.SECURE_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    enableLog: true,
    loggerFn: ignoreLogger,
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});

const create_url = async (amount, des, id_order, ip) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        console.log(`${process.env.BE_URL}/vnpay`)
        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ip || '127.0.0.1', // Fallback nếu không lấy được IP
            vnp_TxnRef: id_order,
            vnp_OrderInfo: des || 'Thanh toan don hang',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `${process.env.BE_URL}/vnpay`, 
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
        });
        
        return paymentUrl;
    } catch (error) {
        throw error;
    }
};

const handle_Callback = async (query) => {
    try {
        const verify = vnpay.verifyReturnUrl(query);

        if (!verify.isVerified) {
            return {
                status: 'error',
                code: '97',
                message: 'Checksum failed (Chữ ký không hợp lệ)',
            };
        }

        if (verify.vnp_ResponseCode === '00' || verify.vnp_ResponseCode === 0) {
            const id_trans = verify.vnp_TxnRef
            const mangKetQua = id_trans.split('-');
            const  madotthu =  parseInt(mangKetQua[0])
            const mahokhau = parseInt(mangKetQua[1])
            const loaiphi = parseInt(mangKetQua[2])
            if (loaiphi == 0){
                await prisma.dANHSACHTHUPHI.update({
                where:{
                    MADOTTHU:madotthu,
                    MAHOKHAU:mahokhau
                },
                data:{
                    NGAYDONG:new Date(),
                    SOTIENDADONG:parseInt(verify.vnp_Amount),
                    HINHTHUC:"CK",
                    TRANGTHAI:true
                }
            })
            }
            if (loaiphi == 1){
                 await prisma.dONGGOP.update({
                where:{
                    MADOTTHU:madotthu,
                    MAHOKHAU:mahokhau
                },
                data:{
                    NGAYDONG:new Date(),
                    SOTIENDADONG:parseInt(verify.vnp_Amount),
                    HINHTHUC:"CK",
                    TRANGTHAI:true
                }
            })
            }
            
            return {
                status: 'success',
                code: '00',
                message: 'Giao dịch thành công',
                data: verify
            };
        } else {
            return {
                status: 'fail',
                code: verify.vnp_ResponseCode,
                message: 'Giao dịch thất bại',
                data: verify
            };
        }
        // console.log(query)
    } catch (error) {
        throw error;
    }
};

module.exports = {
    create_url,
    handle_Callback
};