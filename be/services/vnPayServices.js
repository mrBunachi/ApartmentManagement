import { VNPay, ignoreLogger } from 'vnpay';
import { ProductCode, VnpLocale, dateFormat } from 'vnpay';
import { VerifyReturnUrl } from 'vnpay';

require('dotenv').config();




const create_url = async (amount, des,id_order,ip) =>{
    try{
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
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ip,
            vnp_TxnRef: id_order,
            vnp_OrderInfo: des || 'Thanh toan don hang',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `${process.env.BE_URL}/vnpay/return`,
            vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
            vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
            vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
        });
        return paymentURL
    }
    catch(error){
        throw error
    }
    
}
const handle_Callback = async (query) => {
    try{
        
    }
    catch(error){
        throw error
    }
}

module.exports = {
    create_url,
    handle_Callback
}

