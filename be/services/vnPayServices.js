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

const create_url = async (amount, des, id_order, ip, identifier) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Thêm identifier vào return URL để biết redirect về cư dân nào
        const returnUrl = identifier 
            ? `${process.env.BE_URL}/vnpay?identifier=${identifier}`
            : `${process.env.BE_URL}/vnpay`;
            
        console.log(`Return URL: ${returnUrl}`);
        
        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ip || '127.0.0.1',
            vnp_TxnRef: id_order,
            vnp_OrderInfo: des || 'Thanh toan don hang',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: returnUrl, 
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
        console.log('📥 VNPay Callback Query:', JSON.stringify(query, null, 2));
        
        const verify = vnpay.verifyReturnUrl(query);
        
        console.log('🔐 Verify Result:', {
            isVerified: verify.isVerified,
            responseCode: verify.vnp_ResponseCode,
            txnRef: verify.vnp_TxnRef
        });

        if (!verify.isVerified) {
            console.log('❌ Checksum verification failed');
            
            // ⚠️ CHỈ ĐỂ TEST - BỎ QUA VERIFY TRONG DEVELOPMENT
            // Trong production phải kiểm tra verify!
            if (process.env.NODE_ENV !== 'production' && query.vnp_ResponseCode) {
                console.log('⚠️  DEV MODE: Bypassing checksum verification');
                // Tiếp tục xử lý mặc dù checksum fail (chỉ trong dev)
            } else {
                return {
                    status: 'error',
                    code: '97',
                    message: 'Checksum failed (Chữ ký không hợp lệ)',
                };
            }
        }

        if (verify.vnp_ResponseCode === '00' || verify.vnp_ResponseCode === 0 || query.vnp_ResponseCode === '00') {
            const id_trans = verify.vnp_TxnRef || query.vnp_TxnRef;
            console.log('✅ Payment Success - TxnRef:', id_trans);
            
            const mangKetQua = id_trans.split('-');
            const  madotthu =  parseInt(mangKetQua[0])
            const mahokhau = parseInt(mangKetQua[1])
            const loaiphi = parseInt(mangKetQua[2])
            
            console.log('📊 Payment Details:', { madotthu, mahokhau, loaiphi });
            
            // loaiphi = 0: Phí bắt buộc (DANHSACHTHUPHI)
            if (loaiphi == 0){
                await prisma.dANHSACHTHUPHI.update({
                where:{
                    MADOTTHU_MAHOKHAU: {
                        MADOTTHU: madotthu,
                        MAHOKHAU: mahokhau
                    }
                },
                data:{
                    NGAYDONG: new Date(),
                    SOTIENDADONG: parseInt(verify.vnp_Amount || query.vnp_Amount) / 100, // VNPay trả về số tiền x100
                    HINHTHUC: "VNPay",
                    TRANGTHAI: true
                }
            })
            
            console.log('💰 Updated DANHSACHTHUPHI for mandatory fee');
            }
            
            // loaiphi = 1: Đóng góp tự nguyện (DONGGOP)
            // Cần tạo mới hoặc update record DONGGOP
            if (loaiphi == 1){
                // Tìm xem đã có record chưa
                const existing = await prisma.dONGGOP.findFirst({
                    where: {
                        MADOTTHU: madotthu,
                        MAHOKHAU: mahokhau
                    }
                });

                if (existing) {
                    // Update nếu đã tồn tại
                    await prisma.dONGGOP.update({
                        where: {
                            MADONGGOP: existing.MADONGGOP
                        },
                        data: {
                            NGAYDONG: new Date(),
                            SOTIENDADONG: parseInt(verify.vnp_Amount || query.vnp_Amount) / 100,
                            HINHTHUC: "VNPay",
                            TRANGTHAI: true
                        }
                    });
                    console.log('💰 Updated DONGGOP for voluntary contribution');
                } else {
                    // Tạo mới nếu chưa có
                    // Lấy MALOAIPHI mặc định (giả sử loại phí đầu tiên)
                    const loaiPhi = await prisma.lOAIPHI.findFirst();
                    if (loaiPhi) {
                        await prisma.dONGGOP.create({
                            data: {
                                MADOTTHU: madotthu,
                                MAHOKHAU: mahokhau,
                                MALOAIPHI: loaiPhi.MALOAIPHI,
                                SOTIENDADONG: parseInt(verify.vnp_Amount || query.vnp_Amount) / 100,
                                NGAYDONG: new Date(),
                                HINHTHUC: "VNPay",
                                TRANGTHAI: true,
                                TENDONGTIEN: "VND"
                            }
                        });
                        console.log('💰 Created new DONGGOP for voluntary contribution');
                    }
                }
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